<script lang="ts">
	import TabBar from '$lib/components/TabBar.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	let hideTabBar = $derived(
		page.url.pathname.startsWith('/pills/new') ||
			page.url.pathname.match(/^\/pills\/[^/]+(\/edit)?$/) !== null
	);
</script>

<div class="app-shell">
	<main class="content">
		{@render children()}
	</main>
	{#if !hideTabBar}
		<TabBar />
	{/if}
</div>

<style>
	.content {
		padding-bottom: 110px;
	}
</style>
