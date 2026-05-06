import katex from 'katex';

export type MathSegment =
	| { type: 'text'; content: string }
	| { type: 'inline'; content: string }
	| { type: 'display'; content: string };

export function tokenizeMath(text: string): MathSegment[] {
	const out: MathSegment[] = [];
	if (!text) return out;
	let i = 0;
	while (i < text.length) {
		if (text[i] === '$' && text[i + 1] === '$') {
			const end = text.indexOf('$$', i + 2);
			if (end !== -1) {
				out.push({ type: 'display', content: text.slice(i + 2, end) });
				i = end + 2;
				continue;
			}
			out.push({ type: 'text', content: text.slice(i) });
			break;
		}
		if (text[i] === '$') {
			const end = text.indexOf('$', i + 1);
			if (end !== -1) {
				out.push({ type: 'inline', content: text.slice(i + 1, end) });
				i = end + 1;
				continue;
			}
			out.push({ type: 'text', content: text.slice(i) });
			break;
		}
		let next = i + 1;
		while (next < text.length && text[next] !== '$') next++;
		out.push({ type: 'text', content: text.slice(i, next) });
		i = next;
	}
	return out;
}

export function renderMathToHtml(text: string): string {
	const segments = tokenizeMath(text);
	return segments
		.map((seg) => {
			if (seg.type === 'text') return escapeHtml(seg.content);
			try {
				return katex.renderToString(seg.content, {
					throwOnError: false,
					displayMode: seg.type === 'display'
				});
			} catch {
				return `<code>${escapeHtml(seg.content)}</code>`;
			}
		})
		.join('');
}

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

export function paragraphsWithMath(body: string): { display: string | null; text: string }[] {
	return body.split('\n\n').map((para) => {
		const t = para.trim();
		if (t.startsWith('$$') && t.endsWith('$$')) {
			return { display: t.slice(2, -2), text: '' };
		}
		return { display: null, text: para };
	});
}
