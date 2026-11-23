# Domain Glossary

Shared domain terms used for module naming and seams in `yanxiangzhang.github.io`.

- **Note Catalog** (`src/lib/note-catalog.mjs`, `src/lib/blog-collection.ts`): In-process module owning blog taxonomy (categories, subcategories), display labels, deterministic ordering, visibility exclusions (home feed and RSS), subcategory disclosures, directory sibling context, search index records, and UTC calendar-date formatting.
- **Obsidian Publisher** (`scripts/lib/obsidian-publisher.mjs`): Deep publishing module owning Obsidian note selection (root-graph and category-map modes), hash-variant deduplication, wiki-link and image conversion, YAML frontmatter serialization, incremental manifest tracking, and category-scoped cleanup behind thin CLI adapters (`scripts/publish-obsidian.mjs`, `scripts/publish-introduction-to-algorithms.mjs`).
- **Page Shell** (`src/layouts/PageShell.astro`): Shared document chrome module owning `<html>`, `<BaseHead>`, `<Header>` (with active navigation logic folded in), and `<Footer>` across all site pages and article layouts.
- **Note Listing** (`src/components/NoteListing.astro`): Shared archive presentation module rendering category rows, note rows, pinned frames, formatted UTC dates, and empty states across `/blog/`, `/blog/[category]/`, and `/blog/[category]/[subcategory]/`.
- **Code-Font Subsetter** (`scripts/lib/code-font-subsetter.mjs`, `scripts/subset-font.py`, `scripts/build-fonts.mjs`): Build module owning the single source-text codepoint scan, cache signature/output-hash verification, and Python environment setup, delegating WOFF2 subsetting across an explicit `--codepoints-file` seam to a thin `fontTools` adapter.
