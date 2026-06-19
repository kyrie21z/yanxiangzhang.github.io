const defaultTitles = {
	abstract: '摘要',
	bug: '问题',
	danger: '危险',
	example: '示例',
	failure: '错误',
	info: '信息',
	important: '重要',
	note: '备注',
	question: '问题',
	quote: '引用',
	success: '成功',
	summary: '总结',
	theorem: '定理',
	tip: '提示',
	warning: '警告',
};

function visit(node) {
	if (!node || typeof node !== 'object') return;

	if (node.type === 'blockquote') {
		const firstParagraph = node.children?.[0];
		const firstText = firstParagraph?.type === 'paragraph' ? firstParagraph.children?.[0] : null;
		const match =
			firstText?.type === 'text'
				? firstText.value.match(/^\[!([a-z][\w-]*)\][+-]?[ \t]*([^\n]*)\n?/i)
				: null;

		if (match) {
			const type = match[1].toLowerCase();
			const title = match[2].trim() || defaultTitles[type] || type;

			node.data = {
				...node.data,
				hProperties: {
					...node.data?.hProperties,
					className: ['callout', `callout-${type}`],
					'data-callout': type,
				},
			};

			firstText.value = firstText.value.slice(match[0].length);
			if (!firstText.value) firstParagraph.children.shift();
			if (firstParagraph.children.length === 0) node.children.shift();

			node.children.unshift({
				type: 'paragraph',
				data: {
					hProperties: {
						className: ['callout-title'],
					},
				},
				children: [{ type: 'text', value: title }],
			});
		}
	}

	for (const child of node.children || []) visit(child);
}

export default function remarkCallouts() {
	return (tree) => visit(tree);
}
