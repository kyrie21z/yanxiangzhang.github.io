export interface NoteEntryData {
	title: string;
	description: string;
	pubDate: Date;
	updatedDate?: Date;
	heroImage?: unknown;
	pinned?: boolean;
}

export interface NoteEntry<TData extends NoteEntryData = NoteEntryData> {
	id: string;
	data: TData;
}

export interface CatalogNote<TEntry extends NoteEntry = NoteEntry> {
	entry: TEntry;
	id: string;
	data: TEntry['data'];
	url: string;
	category: string;
	categoryLabel: string;
	subcategory: string | null;
	subcategoryLabel: string | null;
	directoryParts: string[];
	directoryPath: string;
	categoryTrail: string;
	formattedDate: string;
	isExample: boolean;
}

export interface CategorySummary {
	slug: string;
	label: string;
	count: number;
	url: string;
}

export interface CategoryPageData<TEntry extends NoteEntry = NoteEntry> {
	slug: string;
	label: string;
	url: string;
	subCategories: CategorySummary[];
	directPosts: CatalogNote<TEntry>[];
}

export interface SubcategoryPageData<TEntry extends NoteEntry = NoteEntry> {
	category: string;
	categoryLabel: string;
	categoryUrl: string;
	subcategory: string;
	subcategoryLabel: string;
	url: string;
	disclosure: string | null;
	posts: CatalogNote<TEntry>[];
}

export interface DirectoryContext<TEntry extends NoteEntry = NoteEntry> {
	currentId: string;
	directoryPath: string;
	directoryLabel: string;
	directoryUrl: string;
	posts: CatalogNote<TEntry>[];
}

export interface SearchIndexItem {
	title: string;
	description: string;
	url: string;
	date: string;
	formattedDate: string;
	category: string;
	categorySlug: string;
	pinned: boolean;
}

export interface RssNoteItem extends NoteEntryData {
	link: string;
}

export interface NoteCatalog<TEntry extends NoteEntry = NoteEntry> {
	allNotes(): CatalogNote<TEntry>[];
	homeFeed(limit?: number): {
		featured: CatalogNote<TEntry> | null;
		remaining: CatalogNote<TEntry>[];
	};
	topCategories(): CategorySummary[];
	categoryPages(): CategoryPageData<TEntry>[];
	subcategoryPages(): SubcategoryPageData<TEntry>[];
	directoryContext(noteId: string): DirectoryContext<TEntry>;
	searchIndex(): SearchIndexItem[];
	rssItems(): RssNoteItem[];
}

export function formatUtcDate(date: Date | string): string;
export function serializeForScript(value: unknown): string;
export function formatTaxonomyLabel(segment: string): string;
export function createNoteCatalog<TEntry extends NoteEntry>(entries: TEntry[]): NoteCatalog<TEntry>;
