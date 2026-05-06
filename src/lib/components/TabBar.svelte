<script lang="ts">
	import { page } from '$app/state';
	import Icon from './Icon.svelte';

	const tabs = [
		{ href: '/', label: 'Oggi', icon: 'home' as const, match: (p: string) => p === '/' },
		{
			href: '/library',
			label: 'Biblioteca',
			icon: 'library' as const,
			match: (p: string) => p.startsWith('/library')
		},
		{
			href: '/search',
			label: 'Cerca',
			icon: 'search' as const,
			match: (p: string) => p.startsWith('/search')
		},
		{
			href: '/profile',
			label: 'Tu',
			icon: 'user' as const,
			match: (p: string) => p.startsWith('/profile')
		}
	];
</script>

<nav class="tabbar" aria-label="Navigazione principale">
	<div class="pill">
		{#each tabs as t (t.href)}
			{@const active = t.match(page.url.pathname)}
			<a href={t.href} class="tab" class:active aria-current={active ? 'page' : undefined}>
				<Icon name={t.icon} size={20} filled={active} />
				<span class="label">{t.label}</span>
			</a>
		{/each}
	</div>

	<a href="/pills/new" class="add-btn" aria-label="Nuova pillola">
		<Icon name="plus" size={24} />
	</a>
</nav>

<style>
	.tabbar {
		position: fixed;
		bottom: calc(16px + env(safe-area-inset-bottom));
		left: 16px;
		right: 16px;
		max-width: 608px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		gap: 10px;
		z-index: 40;
	}

	.pill {
		flex: 1;
		display: flex;
		justify-content: space-around;
		background: rgba(255, 252, 244, 0.92);
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border-radius: 9999px;
		padding: 8px;
		border: 1px solid var(--color-ink-border);
		box-shadow:
			0 1px 0 rgba(26, 31, 46, 0.04),
			0 8px 24px rgba(26, 31, 46, 0.08);
	}

	.tab {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: 6px 10px;
		text-decoration: none;
		color: var(--color-ink-subtle);
		transition: color 0.15s ease;
	}

	.tab.active {
		color: var(--color-ink);
	}

	.label {
		font-size: 10px;
		letter-spacing: 0.04em;
		font-weight: 500;
	}

	.tab.active .label {
		font-weight: 600;
	}

	.add-btn {
		width: 56px;
		height: 56px;
		border-radius: 9999px;
		background: var(--color-accent);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		box-shadow:
			0 6px 20px color-mix(in srgb, var(--color-accent) 30%, transparent),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
	}
</style>
