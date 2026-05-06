<script lang="ts">
	import { renderMathToHtml } from '$lib/utils/math';

	type Props = {
		text: string;
		inline?: boolean;
		class?: string;
	};

	let { text, inline = false, class: cls = '' }: Props = $props();

	let html = $derived(renderMathToHtml(text ?? ''));
</script>

{#if inline}
	<span class={cls}>{@html html}</span>
{:else}
	<div class={cls}>{@html html}</div>
{/if}
