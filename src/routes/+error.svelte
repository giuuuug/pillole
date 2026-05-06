<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	onMount(() => {
		goto('/', { replaceState: true });
	});
</script>

<div style="padding:24px;font-family:system-ui">Reindirizzamento…</div>
