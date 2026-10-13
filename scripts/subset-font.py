"""Build the site's code font from source text; preserve the complete source font."""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'scripts/fonts/maple-mono-full.woff2'
OUTPUT = ROOT / 'src/assets/fonts/maple-mono-subset.woff2'
TEXT_EXTENSIONS = {'.md', '.mdx', '.astro', '.css', '.ts', '.js', '.mjs'}

characters = set(range(32, 127))
for path in sorted((ROOT / 'src').rglob('*')):
    if path.is_file() and path.suffix in TEXT_EXTENSIONS:
        characters.update(map(ord, path.read_text(encoding='utf-8')))

font = TTFont(SOURCE, recalcTimestamp=False)
required = characters & set(font.getBestCmap())
options = subset.Options()
options.layout_features = ['*']
options.name_IDs = ['*']
options.name_languages = ['*']
options.recalc_timestamp = False
subsetter = subset.Subsetter(options=options)
subsetter.populate(unicodes=sorted(required))
subsetter.subset(font)
font.flavor = 'woff2'
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
temporary = OUTPUT.with_suffix('.tmp.woff2')
font.save(temporary)
font.close()

with TTFont(temporary) as result:
    missing = required - set(result.getBestCmap())
    if missing:
        temporary.unlink()
        raise RuntimeError(f'Font subset lost {len(missing)} required characters')
temporary.replace(OUTPUT)
print(f'Code font: {SOURCE.stat().st_size:,} → {OUTPUT.stat().st_size:,} bytes; {len(required)} characters covered')
