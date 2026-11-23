"""Thin fontTools adapter: subset a source font to an explicit codepoint list."""
import argparse
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Subset a font file for explicit Unicode codepoints.')
    parser.add_argument('--source', type=Path, required=True, help='Complete source font file')
    parser.add_argument('--output', type=Path, required=True, help='Output subset woff2 path')
    parser.add_argument(
        '--codepoints-file',
        type=Path,
        required=True,
        help='File containing comma- or whitespace-separated decimal Unicode codepoints',
    )
    return parser.parse_args()


def load_codepoints(path: Path) -> set[int]:
    raw = path.read_text(encoding='utf-8').replace(',', ' ')
    return {int(token) for token in raw.split() if token}


def main() -> None:
    args = parse_args()
    characters = load_codepoints(args.codepoints_file)

    font = TTFont(args.source, recalcTimestamp=False)
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

    args.output.parent.mkdir(parents=True, exist_ok=True)
    temporary = args.output.with_suffix('.tmp.woff2')
    font.save(temporary)
    font.close()

    with TTFont(temporary) as result:
        missing = required - set(result.getBestCmap())
        if missing:
            temporary.unlink()
            raise RuntimeError(f'Font subset lost {len(missing)} required characters')

    temporary.replace(args.output)
    print(
        f'Code font: {args.source.stat().st_size:,} → {args.output.stat().st_size:,} bytes; '
        f'{len(required)} characters covered'
    )


if __name__ == '__main__':
    main()
