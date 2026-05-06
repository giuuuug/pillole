<script lang="ts">
	type Props = {
		color?: string;
		size?: number;
		vertical?: boolean;
	};

	let { color = '#B8853E', size = 18, vertical = false }: Props = $props();

	let width = $derived(vertical ? size * 0.45 : size);
	let height = $derived(vertical ? size : size * 0.45);
	let direction = $derived(vertical ? '180deg' : '90deg');
</script>

<span
	class="capsule"
	style:width="{width}px"
	style:height="{height}px"
	style:background="linear-gradient({direction}, {color} 50%, var(--color-paper) 50%)"
	aria-hidden="true"
></span>

<style>
	.capsule {
		display: inline-block;
		border-radius: 9999px;
		flex-shrink: 0;
		box-shadow:
			inset 0 0 0 1px rgba(0, 0, 0, 0.12),
			inset 1px 1px 0 rgba(255, 255, 255, 0.4);
	}
</style>
