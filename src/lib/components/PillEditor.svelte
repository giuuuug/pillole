<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import MathText from './MathText.svelte';

	type Props = {
		value: string;
		onChange: (text: string) => void;
		placeholder?: string;
	};

	let { value = $bindable(''), onChange, placeholder = 'Scrivi la pillola…' }: Props = $props();

	let host: HTMLDivElement;
	let editor: Editor | undefined = $state();
	let charCount = $derived(value.length);
	let readingMin = $derived(
		Math.max(1, Math.ceil(value.split(/\s+/).filter(Boolean).length / 200))
	);
	let showPreview = $state(false);
	let canPreview = $derived(value.includes('$'));

	$effect(() => {
		if (!canPreview) showPreview = false;
	});

	onMount(() => {
		const initial = value;
		const initialPlaceholder = placeholder;
		editor = new Editor({
			element: host,
			extensions: [
				StarterKit.configure({
					heading: false,
					codeBlock: false,
					blockquote: false,
					horizontalRule: false
				})
			],
			content: textToDoc(initial),
			editorProps: {
				attributes: {
					class: 'pill-editor-content',
					'data-placeholder': initialPlaceholder
				}
			},
			onUpdate({ editor }) {
				const text = docToText(editor);
				onChange(text);
			}
		});
	});

	onDestroy(() => editor?.destroy());

	function docToText(ed: Editor): string {
		const json = ed.getJSON();
		const blocks: string[] = [];
		for (const node of (json.content ?? []) as Array<{
			type: string;
			content?: Array<{ text?: string }>;
		}>) {
			if (node.type === 'paragraph') {
				const text = (node.content ?? []).map((c) => c.text ?? '').join('');
				blocks.push(text);
			}
		}
		return blocks.join('\n\n');
	}

	function textToDoc(text: string) {
		const paragraphs = text.split('\n\n');
		return {
			type: 'doc',
			content: paragraphs.map((p) => ({
				type: 'paragraph',
				content: p ? [{ type: 'text', text: p }] : []
			}))
		};
	}

	function insert(snippet: string) {
		if (!editor) return;
		editor.chain().focus().insertContent(snippet).run();
	}

	function insertBlockMath() {
		if (!editor) return;
		editor
			.chain()
			.focus()
			.insertContent({ type: 'paragraph' })
			.insertContent('$$\\int_{a}^{b} f(x)\\,dx$$')
			.insertContent({ type: 'paragraph' })
			.run();
	}
</script>

<div class="composer-editor">
	<div class="preview-toggle-wrap">
		<button
			type="button"
			class="preview-btn"
			class:hidden={!canPreview}
			onclick={() => (showPreview = !showPreview)}
			aria-hidden={!canPreview}
			tabindex={canPreview ? 0 : -1}
		>
			{showPreview ? 'Testo' : 'Preview'}
		</button>
	</div>
	<div class="editor-surface">
		<div bind:this={host} class="editor-host" class:hidden={showPreview}></div>
		{#if showPreview}
			<div class="preview card-paper preview-inline">
				<MathText class="preview-body" text={value} />
			</div>
		{/if}
	</div>

	<div class="formula-toolbar">
		<span class="eyebrow-strong toolbar-label">Inserisci</span>
		<button type="button" class="formula-btn" onclick={() => insert('$E=mc^2$')}
			>∑ formula in linea</button
		>
		<button type="button" class="formula-btn" onclick={insertBlockMath}>∫ formula in blocco</button>
		<button
			type="button"
			class="formula-btn"
			onclick={() => insert('$\\alpha\\ \\beta\\ \\gamma\\ \\omega$')}>α greche</button
		>
		<button type="button" class="formula-btn" onclick={() => insert('$x^2_n$')}>x² pedici</button>
	</div>

	<p class="hint">
		Scrivi formule LaTeX tra <code>$…$</code> (in linea) oppure <code>$$…$$</code> (in blocco).<br
		/>
		{charCount} caratteri · ~{readingMin} min di lettura
	</p>
</div>

<style>
	.composer-editor {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.preview-toggle-wrap {
		display: flex;
		justify-content: flex-end;
		min-height: 16px;
	}

	.preview-btn {
		background: none;
		border: none;
		padding: 0;
		font-size: 11px;
		font-family: var(--font-serif);
		font-style: italic;
		color: var(--color-ink);
		cursor: pointer;
		min-width: 7ch;
		text-align: right;
	}

	.preview-btn.hidden {
		visibility: hidden;
		pointer-events: none;
	}

	.editor-surface {
		display: flex;
		flex-direction: column;
	}

	.editor-host {
		touch-action: pan-y;
	}

	.editor-host.hidden {
		display: none;
	}

	.editor-host :global(.pill-editor-content) {
		font-family: var(--font-serif);
		font-size: 17px;
		line-height: 1.65;
		color: var(--color-ink);
		min-height: 220px;
		outline: none;
		touch-action: pan-y;
		overscroll-behavior: contain;
	}

	.editor-host :global(.pill-editor-content p) {
		margin: 0 0 14px;
	}

	.editor-host :global(.pill-editor-content p.is-editor-empty:first-child::before) {
		content: attr(data-placeholder);
		float: left;
		color: var(--color-ink-subtle);
		font-style: italic;
		pointer-events: none;
		height: 0;
	}

	.formula-toolbar {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		align-items: center;
	}

	.toolbar-label {
		margin-right: 4px;
	}

	.formula-btn {
		font-size: 11px;
		padding: 5px 10px;
		border-radius: 9999px;
		border: 1px solid var(--color-ink-border);
		background: transparent;
		color: var(--color-ink);
		cursor: pointer;
		font-family: var(--font-serif);
		font-style: italic;
	}

	.hint {
		font-size: 11px;
		color: var(--color-ink-subtle);
		font-style: italic;
		font-family: var(--font-serif);
		line-height: 1.5;
		margin: 0;
	}

	.hint code {
		background: var(--color-paper-card);
		padding: 1px 5px;
		border-radius: 3px;
		font-style: normal;
		font-family: var(--font-sans);
	}

	.preview {
		padding: 14px 16px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.preview-inline {
		min-height: 220px;
	}

	.preview :global(.preview-body) {
		font-family: var(--font-serif);
		font-size: 15px;
		line-height: 1.6;
		color: var(--color-ink);
		white-space: pre-wrap;
	}
</style>
