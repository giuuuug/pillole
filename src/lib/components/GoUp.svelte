<script lang="ts">
	import { onMount } from 'svelte';

	let { bottomOffset = 24 } = $props();

	let visible = $state(false);

	function updateVisibility() {
		if (typeof window === 'undefined') return;
		visible = window.scrollY > 420;
	}

	function goUp() {
		if (typeof window === 'undefined') return;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	onMount(() => {
		updateVisibility();
	});
</script>

<svelte:window onscroll={updateVisibility} onresize={updateVisibility} />

<button
	type="button"
	class="go-up"
	class:show={visible}
	style:--go-up-bottom={`${bottomOffset}px`}
	onclick={goUp}
	aria-label="Torna su"
>
	↑
</button>

<style>
	.go-up {
		position: fixed;
		right: 18px;
		bottom: calc(var(--go-up-bottom) + env(safe-area-inset-bottom, 0px));
		width: 44px;
		height: 44px;
		border-radius: 9999px;
		border: 1px solid var(--color-ink-border);
		background: var(--color-paper);
		color: var(--color-ink);
		font-size: 18px;
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
		opacity: 0;
		pointer-events: none;
		transform: translateY(8px);
		transition:
			opacity 0.18s ease,
			transform 0.18s ease,
			box-shadow 0.18s ease;
		z-index: 20;
	}

	.go-up.show {
		opacity: 1;
		pointer-events: auto;
		transform: translateY(0);
	}

	.go-up:hover {
		box-shadow: 0 10px 22px rgba(0, 0, 0, 0.12);
	}
</style>
