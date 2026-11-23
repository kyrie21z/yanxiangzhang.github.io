# Domain Glossary

Shared domain terms used for module naming and seams in `yanxiangzhang.github.io`.

- **Note Catalog** (`src/lib/note-catalog.mjs`, `src/lib/blog-collection.ts`): In-process module owning blog taxonomy (categories, subcategories), display labels, deterministic ordering, visibility exclusions (home feed and RSS), subcategory disclosures, directory sibling context, search index records, and UTC calendar-date formatting.
- **Obsidian Publisher** (`scripts/lib/obsidian-publisher.mjs`): Deep publishing module owning Obsidian note selection (root-graph and category-map modes), hash-variant deduplication, wiki-link and image conversion, YAML frontmatter serialization, incremental manifest tracking, and category-scoped cleanup behind thin CLI adapters (`scripts/publish-obsidian.mjs`, `scripts/publish-introduction-to-algorithms.mjs`).
