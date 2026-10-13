function wrapTables(node) {
	if (!Array.isArray(node.children)) return;

	node.children = node.children.map((child) => {
		wrapTables(child);
		if (child.type !== 'element' || child.tagName !== 'table') return child;

		return {
			type: 'element',
			tagName: 'div',
			properties: {
				className: ['table-scroll'],
				tabIndex: 0,
				role: 'group',
				ariaLabel: '表格，可横向滚动',
			},
			children: [child],
		};
	});
}

export default function rehypeScrollableTables() {
	return (tree) => wrapTables(tree);
}
