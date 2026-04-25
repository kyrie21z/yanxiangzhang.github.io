/**
 * Obsidian Vault → Astro Blog 转换脚本
 * 将 Obsidian Vault 中的笔记转换为 Astro Content Collection 格式并发布到 blog
 * 支持：去重（同名笔记合并）、增量更新（仅处理变更文件）
 */

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, statSync, existsSync, unlinkSync } from 'fs';
import { createHash } from 'crypto';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const VAULT_DIR = join(ROOT, 'Obsidian Vault');
const BLOG_DIR = join(ROOT, 'src/content/blog');
const ASSETS_DIR = join(ROOT, 'src/assets');
const MANIFEST_PATH = join(ROOT, 'scripts/.publish-manifest.json');

// ─── 分类映射 ─────────────────────────────────────────────────────────────────
function getCategory(filename) {
  const lower = filename.toLowerCase();

  if (lower.includes('组件实现') || lower.includes('登录界面')) {
    return 'CS-Major-Courses/Desktop Application Develop';
  }
  if (
    lower.includes('hashing') ||
    lower.includes('quick select') ||
    lower.includes('quick sort') ||
    lower.includes('bfprt') ||
    lower.includes('order statistic') ||
    lower.includes('divide') ||
    lower.includes('trick for analyzing') ||
    lower.includes('introduction to algorithms')
  ) {
    return 'CS-Major-Courses/Algorithm Analysis and Design';
  }
  if (
    lower.includes('ndarray') ||
    lower.includes('ufunc') ||
    lower.includes('numpy') ||
    lower.includes('pandas') ||
    lower.includes('scipy') ||
    lower.includes('pickle')
  ) {
    return 'CS-Major-Courses/Python and Data Science';
  }
  return null;
}

// ─── 跳过的文件（目录/索引/空文件）──────────────────────────────────────────
const SKIP_FILES = new Set([
  'Desktop Application Develop 桌面应用开发.md',
  'Introduction to Algorithms 算法导论.md',
  'Python and Data Science Python 与数据科学.md',
  'Marxist Philosophy 马克思主义哲学.md',
  'Numpy.md',
  'Pandas.md',
  'Scipy.md',
  'Pickle.md',
  'AAA ProCourse.md',
  'ndarray 多维数组.md',
  'ufunc 普遍函数.md',
  'numpy文件数据存取.md',
]);

// ─── 去重：提取不带哈希后缀的基础名称 ──────────────────────────────────────
// 匹配文件名末尾的 "-<12位hex>.md" 模式，如 "XXX-25da1fd0052d.md"
const HASH_SUFFIX_RE = /-[0-9a-f]{12}\.md$/i;

function getBaseName(filename) {
  if (HASH_SUFFIX_RE.test(filename)) {
    return filename.replace(/-[0-9a-f]{12}\.md$/i, '.md');
  }
  return filename;
}

// ─── Manifest 读写（增量更新）────────────────────────────────────────────────
function loadManifest() {
  if (existsSync(MANIFEST_PATH)) {
    try {
      return JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));
    } catch { return { files: {}, images: {} }; }
  }
  return { files: {}, images: {} };
}

function saveManifest(manifest) {
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
}

function contentHash(filepath) {
  const data = readFileSync(filepath);
  return createHash('md5').update(data).digest('hex');
}

// ─── 图片文件名净化（去除空格，Vite 友好）──────────────────────────────────
function sanitizeImageName(filename) {
  return filename.replace(/ /g, '-');
}

// ─── 将名称转换为 Astro URL slug（小写 ASCII + 空格转连字符）────────────────
function toUrlSlug(str) {
  return str.replace(/[A-Z]/g, (c) => c.toLowerCase()).replace(/ /g, '-');
}

// ─── 预扫描 Vault，构建「笔记名 → 博客 URL」映射表 ────────────────────────
function buildNoteUrlMap() {
  const map = new Map();
  const allFiles = readdirSync(VAULT_DIR).filter((f) => f.endsWith('.md'));
  const files = deduplicateFiles(allFiles);

  for (const file of files) {
    if (SKIP_FILES.has(file) || SKIP_FILES.has(getBaseName(file))) continue;

    const filepath = join(VAULT_DIR, file);
    const stat = statSync(filepath);
    if (stat.size < 50) continue;

    const category = getCategory(file);
    if (!category) continue;

    const content = readFileSync(filepath, 'utf-8');
    if (!hasRealContent(content)) continue;

    const title = basename(getBaseName(file), '.md');
    const url = `/blog/${toUrlSlug(category)}/${toUrlSlug(title)}/`;
    map.set(title, url);
  }

  return map;
}

// ─── 内容转换 ─────────────────────────────────────────────────────────────────
function transformContent(content, noteUrlMap, category) {
  // 计算图片相对路径深度（基于分类嵌套层级）
  const depth = category.split('/').length; // 1 for flat, 2 for nested
  const imgPrefix = '../'.repeat(depth + 2) + 'assets/'; // +2 for content/blog/

  // ![[image.png]] → ![image](relative-assets-path/image.png)
  content = content.replace(
    /!\[\[([^\]]+\.(png|jpg|jpeg|gif|svg|webp))\]\]/gi,
    (_, filename) => {
      const sanitized = sanitizeImageName(filename);
      return `![${sanitized}](${imgPrefix}${sanitized})`;
    }
  );

  // [[Note|Display Text]] → [Display Text](url) 或 Display Text（若未发布）
  content = content.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_, note, display) => {
    const url = noteUrlMap.get(note.trim());
    return url ? `[${display}](${url})` : display;
  });

  // [[Note]] → [Note](url) 或 *Note*（若目标笔记未发布）
  content = content.replace(/\[\[([^\]]+)\]\]/g, (_, note) => {
    const url = noteUrlMap.get(note.trim());
    return url ? `[${note}](${url})` : `*${note}*`;
  });

  // ─── LaTeX 分隔符转换 ───────────────────────────────────────────────────────
  // 块级：[  \n...\n] → $$\n...\n$$
  content = content.replace(new RegExp('^\\[  \\n(.+)\\n\\]', 'gm'), '$$$$\n$1\n$$$$');

  // 行内：(\text{...}) (\alpha) 等 → $...$
  const latexCmds = 'text|alpha|beta|gamma|delta|theta|Theta|lambda|sigma|Sigma|pi|Pi|mu|nu|omega|Omega|epsilon|varepsilon|phi|varphi|psi|rho|tau|chi|zeta|eta|kappa|iota|xi|Xi|infty|partial|nabla|sum|prod|int|sqrt|frac|mathbb|mathrm|mathcal|rightarrow|Rightarrow|leftarrow|Leftarrow|leftrightarrow|xrightarrow|ne|neq|le|ge|leq|geq|quad|qquad|cdot|cdots|ldots|bmod|pmod|gcd|log|ln|exp|sin|cos|tan|lim|max|min|sup|inf|det|dim|ker|hom|arg|deg|Pr';
  content = content.replace(new RegExp('\\(\\\\(' + latexCmds + ')([^)]*)\\)', 'g'), (match, cmd, rest) => {
    return `$\\${cmd}${rest}$`;
  });

  return content;
}

// ─── 判断是否有实质内容（排除纯链接索引文件）────────────────────────────────
function hasRealContent(content) {
  const stripped = content
    .replace(/\[\[.*?\]\]/g, '')
    .replace(/^\s*\d+\.\s*$/gm, '')
    .replace(/^\s*-\s*$/gm, '')
    .trim();
  return stripped.length > 80;
}

// ─── 从文件系统获取修改时间作为发布日期 ──────────────────────────────────────
function getFileDate(filepath) {
  const stat = statSync(filepath);
  const d = stat.mtime;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ─── 从 Markdown 内容提取摘要作为 description ────────────────────────────────
function extractDescription(content, maxLen = 160) {
  // 移除 frontmatter
  let text = content.replace(/^---[\s\S]*?---\s*/m, '');
  // 移除图片、链接语法、HTML 标签
  text = text.replace(/!\[.*?\]\(.*?\)/g, '');
  text = text.replace(/\[([^\]]+)\]\(.*?\)/g, '$1');
  text = text.replace(/!\[\[.*?\]\]/g, '');
  text = text.replace(/\[\[([^\]|]+)(\|([^\]]+))?\]\]/g, (_, note, __, display) => display || note);
  text = text.replace(/<[^>]+>/g, '');
  // 移除标题标记、粗体/斜体、代码块
  text = text.replace(/^#{1,6}\s+/gm, '');
  text = text.replace(/```[\s\S]*?```/g, '');
  text = text.replace(/`[^`]+`/g, '');
  text = text.replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1');
  // 合并空白，取前 maxLen 字符
  text = text.replace(/\s+/g, ' ').trim();
  if (text.length > maxLen) {
    text = text.slice(0, maxLen - 3) + '...';
  }
  return text;
}

// ─── 去重：从多个同名文件中选择最佳版本 ─────────────────────────────────────
function deduplicateFiles(files) {
  const groups = new Map(); // baseName → [filenames]

  for (const file of files) {
    const base = getBaseName(file);
    if (!groups.has(base)) groups.set(base, []);
    groups.get(base).push(file);
  }

  const result = [];
  for (const [base, variants] of groups) {
    if (variants.length === 1) {
      result.push(variants[0]);
      continue;
    }

    // 多个同名文件：排除索引/空文件，优先选有实质内容的
    const original = variants.find((f) => f === base);
    const hashVersions = variants.filter((f) => f !== base);

    // 检查原始文件是否为索引/无内容
    if (original) {
      const origPath = join(VAULT_DIR, original);
      const origContent = readFileSync(origPath, 'utf-8');
      if (!SKIP_FILES.has(original) && hasRealContent(origContent) && statSync(origPath).size >= 50) {
        result.push(original);
        continue;
      }
    }

    // 原始文件是索引/无内容，尝试用哈希版本
    if (hashVersions.length > 0) {
      result.push(hashVersions[0]);
    } else {
      result.push(original);
    }
  }
  return result;
}

// ─── 清理：删除博客目录中不再需要的旧文件 ────────────────────────────────────
function cleanupOldFiles(publishedSet) {
  let cleaned = 0;
  if (!existsSync(BLOG_DIR)) return 0;

  function walkClean(dir) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        walkClean(full);
      } else if (entry.endsWith('.md') && !publishedSet.has(full)) {
        unlinkSync(full);
        const rel = full.replace(BLOG_DIR + '/', '').replace(BLOG_DIR + '\\', '');
        console.log(`  [cleaned   ] ${rel}`);
        cleaned++;
      }
    }
  }
  walkClean(BLOG_DIR);
  return cleaned;
}

// ─── 主流程 ───────────────────────────────────────────────────────────────────
function main() {
  let published = 0;
  let skipped = 0;
  let unchanged = 0;

  const manifest = loadManifest();
  const newManifest = { files: {}, images: {} };
  const publishedPaths = new Set();

  // 1. 预扫描 Vault，构建笔记名 → URL 映射表
  const noteUrlMap = buildNoteUrlMap();
  console.log(`  [map] 已建立 ${noteUrlMap.size} 条笔记链接映射\n`);

  // 2. 增量复制图片资源到 src/assets/
  const imagesDir = join(VAULT_DIR, 'images');
  if (existsSync(imagesDir)) {
    for (const imgFile of readdirSync(imagesDir)) {
      const src = join(imagesDir, imgFile);
      const sanitized = sanitizeImageName(imgFile);
      const dest = join(ASSETS_DIR, sanitized);
      const hash = contentHash(src);
      newManifest.images[sanitized] = hash;

      if (manifest.images[sanitized] === hash && existsSync(dest)) {
        continue; // 未变更，跳过
      }
      copyFileSync(src, dest);
      console.log(`  [image] ${imgFile} → src/assets/${sanitized}`);
    }
  }

  console.log('');

  // 3. 处理 Markdown 文件（去重后）
  const allFiles = readdirSync(VAULT_DIR).filter((f) => f.endsWith('.md'));
  const files = deduplicateFiles(allFiles);
  const dedupCount = allFiles.length - files.length;
  if (dedupCount > 0) {
    console.log(`  [dedup] 合并了 ${dedupCount} 个重复文件\n`);
  }

  for (const file of files) {
    // 跳过已标记的索引文件（同时检查原始文件名和 baseName）
    if (SKIP_FILES.has(file) || SKIP_FILES.has(getBaseName(file))) {
      skipped++;
      continue;
    }

    const filepath = join(VAULT_DIR, file);
    const stat = statSync(filepath);

    // 跳过空文件（< 50 bytes）
    if (stat.size < 50) {
      skipped++;
      continue;
    }

    // 确定分类（用 baseName 做分类匹配，确保一致性）
    const category = getCategory(file);
    if (!category) {
      skipped++;
      continue;
    }

    const content = readFileSync(filepath, 'utf-8');

    // 跳过纯链接索引（内容不足）
    if (!hasRealContent(content)) {
      skipped++;
      continue;
    }

    // 输出文件名统一使用 baseName（去掉哈希后缀）
    const outputFilename = getBaseName(file);
    const categoryDir = join(BLOG_DIR, category);
    const outPath = join(categoryDir, outputFilename);
    publishedPaths.add(outPath);

    // 增量检查：内容是否变更
    const hash = contentHash(filepath);
    if (manifest.files[outPath] === hash && existsSync(outPath)) {
      newManifest.files[outPath] = hash;
      unchanged++;
      continue;
    }

    // 生成 frontmatter
    const title = basename(outputFilename, '.md');
    const pubDate = getFileDate(filepath);
    const safeTitle = title.replace(/'/g, "\\'");
    const desc = extractDescription(content).replace(/'/g, "\\'");
    const frontmatter = `---\ntitle: '${safeTitle}'\ndescription: '${desc}'\npubDate: '${pubDate}'\n---\n\n`;

    // 转换内容
    const transformed = transformContent(content, noteUrlMap, category);
    const output = frontmatter + transformed;

    // 写入目标路径
    mkdirSync(categoryDir, { recursive: true });
    writeFileSync(outPath, output, 'utf-8');
    newManifest.files[outPath] = hash;

    console.log(`  [published  ] [${category}] ${outputFilename}`);
    published++;
  }

  // 4. 清理博客目录中不在发布列表的旧文件
  const cleaned = cleanupOldFiles(publishedPaths);

  // 5. 保存 manifest
  // 补全未变更的记录
  for (const p of publishedPaths) {
    if (!newManifest.files[p] && manifest.files[p]) {
      newManifest.files[p] = manifest.files[p];
    }
  }
  saveManifest(newManifest);

  console.log(`\n─────────────────────────────────────────`);
  console.log(`  发布：${published} 篇 | 未变更：${unchanged} 篇 | 跳过：${skipped} | 清理：${cleaned}`);
  console.log(`─────────────────────────────────────────`);
}

main();
