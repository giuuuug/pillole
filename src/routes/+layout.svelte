<script lang="ts">
	import './layout.css';
	// @ts-expect-error — package ships without types
	import '@drop-in/graffiti';
	import icon from '$lib/assets/icon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>Pillole - di conoscienza</title>
	<link rel="icon" href={icon} />
</svelte:head>

{@render children()}
