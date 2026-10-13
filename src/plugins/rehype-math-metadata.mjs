function containsMath(node) {
	return node.properties?.className?.includes('katex') || (node.children || []).some(containsMath);
}

export default function rehypeMathMetadata() {
	return (tree, file) => {
		file.data.astro ??= {};
		file.data.astro.frontmatter ??= {};
		file.data.astro.frontmatter.hasMath = Boolean(containsMath(tree));
	};
}
