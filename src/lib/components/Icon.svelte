<script lang="ts">
	type Name =
		| 'plus'
		| 'search'
		| 'home'
		| 'library'
		| 'user'
		| 'back'
		| 'heart'
		| 'share'
		| 'more'
		| 'close'
		| 'filter'
		| 'calendar'
		| 'link'
		| 'sparkle'
		| 'check'
		| 'logout'
		| 'eye'
		| 'eye-off';

	type Props = {
		name: Name;
		size?: number;
		filled?: boolean;
		class?: string;
	};

	let { name, size = 22, filled = false, class: cls = '' }: Props = $props();

	let fillOpacity = $derived(filled ? 0.15 : 0);
	let fill = $derived(filled ? 'currentColor' : 'none');
</script>

{#if name === 'plus'}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" class={cls} aria-hidden="true">
		<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
	</svg>
{:else if name === 'search'}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" class={cls} aria-hidden="true">
		<circle
			cx="11"
			cy="11"
			r="7"
			stroke="currentColor"
			stroke-width="1.6"
			{fill}
			fill-opacity={fillOpacity}
		/>
		<path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
	</svg>
{:else if name === 'home'}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" class={cls} aria-hidden="true">
		<path
			d="M3 11l9-8 9 8v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2v-9z"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linejoin="round"
			{fill}
			fill-opacity={fillOpacity}
		/>
	</svg>
{:else if name === 'library'}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" class={cls} aria-hidden="true">
		<rect
			x="4"
			y="4"
			width="4"
			height="16"
			rx="1"
			stroke="currentColor"
			stroke-width="1.6"
			{fill}
			fill-opacity={fillOpacity}
		/>
		<rect
			x="10"
			y="4"
			width="4"
			height="16"
			rx="1"
			stroke="currentColor"
			stroke-width="1.6"
			{fill}
			fill-opacity={fillOpacity}
		/>
		<rect
			x="16"
			y="6"
			width="4"
			height="14"
			rx="1"
			stroke="currentColor"
			stroke-width="1.6"
			{fill}
			fill-opacity={fillOpacity}
			transform="rotate(-12 18 13)"
		/>
	</svg>
{:else if name === 'user'}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" class={cls} aria-hidden="true">
		<circle
			cx="12"
			cy="8"
			r="4"
			stroke="currentColor"
			stroke-width="1.6"
			{fill}
			fill-opacity={fillOpacity}
		/>
		<path
			d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
			{fill}
			fill-opacity={fillOpacity}
		/>
	</svg>
{:else if name === 'back'}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" class={cls} aria-hidden="true">
		<path
			d="M15 6l-6 6 6 6"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{:else if name === 'heart'}
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill={filled ? 'currentColor' : 'none'}
		class={cls}
		aria-hidden="true"
	>
		<path
			d="M12 21s-7.5-4.6-9.6-9.3C1 8.5 2.7 5 6.1 5c2 0 3.6 1 4.9 2.7C12.3 6 13.9 5 15.9 5c3.4 0 5.1 3.5 3.7 6.7C19.5 16.4 12 21 12 21Z"
			stroke="currentColor"
			stroke-width="1.8"
			stroke-linejoin="round"
			stroke-linecap="round"
		/>
	</svg>
{:else if name === 'share'}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" class={cls} aria-hidden="true">
		<path
			d="M12 3v13M12 3l-4 4M12 3l4 4"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
		/>
	</svg>
{:else if name === 'more'}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" class={cls} aria-hidden="true">
		<circle cx="5" cy="12" r="1.6" fill="currentColor" />
		<circle cx="12" cy="12" r="1.6" fill="currentColor" />
		<circle cx="19" cy="12" r="1.6" fill="currentColor" />
	</svg>
{:else if name === 'close'}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" class={cls} aria-hidden="true">
		<path
			d="M6 6l12 12M18 6L6 18"
			stroke="currentColor"
			stroke-width="1.8"
			stroke-linecap="round"
		/>
	</svg>
{:else if name === 'filter'}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" class={cls} aria-hidden="true">
		<path
			d="M4 5h16M7 12h10M10 19h4"
			stroke="currentColor"
			stroke-width="1.8"
			stroke-linecap="round"
		/>
	</svg>
{:else if name === 'calendar'}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" class={cls} aria-hidden="true">
		<rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.6" />
		<path
			d="M3 9h18M8 3v4M16 3v4"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
		/>
	</svg>
{:else if name === 'link'}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" class={cls} aria-hidden="true">
		<path
			d="M9 15l6-6M10 6h-3a4 4 0 100 8h3M14 18h3a4 4 0 100-8h-3"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
		/>
	</svg>
{:else if name === 'sparkle'}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" class={cls} aria-hidden="true">
		<path
			d="M12 3v6M12 15v6M3 12h6M15 12h6"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
		/>
		<circle cx="12" cy="12" r="2" fill="currentColor" />
	</svg>
{:else if name === 'check'}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" class={cls} aria-hidden="true">
		<path
			d="M5 12l5 5L20 7"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{:else if name === 'logout'}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" class={cls} aria-hidden="true">
		<path
			d="M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4M10 8l-4 4 4 4M6 12h12"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{:else if name === 'eye'}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" class={cls} aria-hidden="true">
		<path
			d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6" />
	</svg>
{:else if name === 'eye-off'}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" class={cls} aria-hidden="true">
		<path d="M3 4l18 16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
		<path
			d="M5 6.5C3.1 8 2 10 2 12c0 0 4 6 10 6 2 0 3.8-.7 5.3-1.7"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M9.8 9.7a3 3 0 003.5 3.6"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
		/>
		<path
			d="M12 6c6 0 10 6 10 6-.6 1-1.7 2.4-3.4 3.6"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/if}
