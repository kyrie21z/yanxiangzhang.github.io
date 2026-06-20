const excludedNodes = new Set(['code', 'inlineCode', 'math', 'inlineMath']);

function splitMarkers(children) {
	const result = [];

	for (const child of children) {
		if (child.type !== 'text' || !child.value.includes('==')) {
			result.push(child);
			continue;
		}

		const parts = child.value.split('==');
		parts.forEach((part, index) => {
			if (part) result.push({ ...child, value: part });
			if (index < parts.length - 1) result.push({ type: 'highlightMarker' });
		});
	}

	return result;
}

function textContent(node) {
	if (node.type === 'text' || node.type === 'inlineCode') return node.value || '';
	return (node.children || []).map(textContent).join('');
}

function wrapHighlights(children) {
	const result = [];
	let openingIndex = -1;

	for (const child of splitMarkers(children)) {
		if (child.type !== 'highlightMarker') {
			result.push(child);
			continue;
		}

		if (openingIndex === -1) {
			openingIndex = result.length;
			result.push(child);
			continue;
		}

		const content = result.slice(openingIndex + 1);
		const value = content.map(textContent).join('');
		const validHighlight =
			content.length > 0 &&
			value.length > 0 &&
			!value.startsWith(' ') &&
			!value.endsWith(' ');

		if (validHighlight) {
			result.splice(openingIndex, result.length - openingIndex, {
				type: 'highlight',
				data: { hName: 'mark' },
				children: content,
			});
			openingIndex = -1;
		} else {
			result.push(child);
			openingIndex = result.length - 1;
		}
	}

	for (const child of result) {
		if (child.type === 'highlightMarker') {
			child.type = 'text';
			child.value = '==';
		}
	}

	return result;
}

function visit(node) {
	if (!node || typeof node !== 'object' || excludedNodes.has(node.type)) return;
	if (!Array.isArray(node.children)) return;

	for (const child of node.children) visit(child);
	node.children = wrapHighlights(node.children);
}

export default function remarkHighlights() {
	return (tree) => visit(tree);
}
