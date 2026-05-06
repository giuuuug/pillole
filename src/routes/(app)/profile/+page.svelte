<script lang="ts">
	import Capsule from '$lib/components/Capsule.svelte';
	import GoUp from '$lib/components/GoUp.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	let { data } = $props();

	let favs = $derived(data.pills.filter((p) => p.favorite));

	let stats = $derived.by(() => {
		const map = new Map<string, { count: number; color: string }>();
		for (const p of data.pills) {
			const name = p.category?.name ?? '—';
			const color = p.category?.color ?? '#888';
			const cur = map.get(name) ?? { count: 0, color };
			cur.count += 1;
			map.set(name, cur);
		}
		const arr = [...map.entries()].sort((a, b) => b[1].count - a[1].count);
		const max = arr.reduce((m, [, v]) => Math.max(m, v.count), 0);
		return { arr, max };
	});

	async function logout() {
		await authClient.signOut();
		await goto('/auth/login');
	}
</script>

<section class="profile">
	<div class="top">
		<div class="masthead">
			<div class="title-line headline">Profilo</div>
		</div>
		<button type="button" class="logout" onclick={logout}>
			<Icon name="logout" size={18} />
			<span>Esci</span>
		</button>
	</div>

	<div class="stats">
		<div>
			<div class="big serif">{data.pills.length}</div>
			<div class="eyebrow-strong stat-label">pillole archiviate</div>
		</div>
		<div class="stat-right">
			<div class="med serif">{favs.length}</div>
			<div class="eyebrow-strong stat-label">preferite</div>
		</div>
	</div>

	{#if stats.arr.length > 0}
		<div class="dist">
			<div class="eyebrow-strong dist-title">Per disciplina</div>
			<div class="dist-list">
				{#each stats.arr as [name, info] (name)}
					<div class="dist-row">
						<div class="dist-meta">
							<div class="dist-name">
								<Capsule color={info.color} size={14} />
								<span>{name}</span>
							</div>
							<span class="dist-count serif">{info.count}</span>
						</div>
						<div class="bar">
							<div
								class="bar-fill"
								style:width="{(info.count / stats.max) * 100}%"
								style:background={info.color}
							></div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if favs.length > 0}
		<div class="favs">
			<div class="eyebrow-strong dist-title">Preferite</div>
			<div class="fav-list">
				{#each favs as p (p.id)}
					<a href="/pills/{p.id}" class="fav-row">
						<span class="heart"><Icon name="heart" size={14} filled /></span>
						<div class="fav-content">
							<div class="fav-title serif">{p.title}</div>
							<div class="fav-cat">{p.category?.name ?? '—'}</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	{/if}
</section>

<GoUp bottomOffset={120} />

<style>
	.profile {
		padding: 22px var(--screen-pad, 24px) 60px;
	}

	.masthead {
		margin: 0 0 10px;
	}

	.title-line {
		font-size: 56px;
		line-height: 0.92;
		letter-spacing: -0.027em;
	}

	@media (max-width: 380px) {
		.title-line {
			font-size: 44px;
		}
	}

	.top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
	}

	.top > div:first-child {
		flex: 1;
		min-width: 0;
		text-align: left;
	}

	.logout {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: var(--color-ink);
		color: var(--color-paper);
		border: 1px solid var(--color-ink);
		border-radius: 9999px;
		height: 44px;
		padding: 0 18px;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		cursor: pointer;
		flex-shrink: 0;
		margin-top: 4px;
		transition: opacity 0.15s ease;
	}

	.logout:hover {
		opacity: 0.85;
	}

	.stats {
		margin-top: 28px;
		padding: 24px 0;
		border-top: 1px solid var(--color-ink-border);
		border-bottom: 1px solid var(--color-ink-border);
		display: flex;
		justify-content: flex-start;
		align-items: flex-end;
		gap: 48px;
		text-align: left;
	}

	.stat-right {
		text-align: left !important;
	}

	.big {
		font-size: 72px;
		line-height: 0.9;
		font-weight: 500;
		color: var(--color-accent);
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.028em;
	}

	.med {
		font-size: 36px;
		line-height: 0.9;
		font-weight: 500;
		color: var(--color-ink);
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.014em;
	}

	.stat-right {
		text-align: right;
	}

	.stat-label {
		margin-top: 6px;
	}

	.dist {
		margin-top: 28px;
	}

	.dist-title {
		margin-bottom: 14px;
	}

	.dist-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.dist-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 5px;
	}

	.dist-name {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 13px;
		color: var(--color-ink);
		letter-spacing: 0.01em;
	}

	.dist-count {
		font-size: 11px;
		color: var(--color-ink-subtle);
		font-variant-numeric: tabular-nums;
	}

	.bar {
		height: 3px;
		background: var(--color-ink-border);
		border-radius: 9999px;
		overflow: hidden;
	}

	.bar-fill {
		height: 100%;
		border-radius: 9999px;
	}

	.favs {
		margin-top: 28px;
	}

	.fav-list {
		display: flex;
		flex-direction: column;
	}

	.fav-row {
		display: flex;
		gap: 12px;
		align-items: center;
		padding: 12px 0;
		border-bottom: 1px solid var(--color-ink-border);
		text-decoration: none;
		color: inherit;
	}

	.fav-row:first-child {
		border-top: 1px solid var(--color-ink-border);
	}

	.heart {
		color: var(--color-accent);
		display: flex;
	}

	.fav-content {
		flex: 1;
	}

	.fav-title {
		font-size: 16px;
		color: var(--color-ink);
		font-weight: 500;
		letter-spacing: -0.01em;
	}

	.fav-cat {
		font-size: 11px;
		color: var(--color-ink-muted);
		margin-top: 2px;
		letter-spacing: 0.02em;
	}

	@media (max-width: 380px) {
		.profile {
			--screen-pad: 18px;
		}

		.big {
			font-size: 56px;
		}

		.med {
			font-size: 30px;
		}
	}
</style>
