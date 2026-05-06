<script lang="ts">
	import Capsule from '$lib/components/Capsule.svelte';
	import GoUp from '$lib/components/GoUp.svelte';
	import PillListItem from '$lib/components/PillListItem.svelte';
	import { formatDateShort } from '$lib/utils/format';
	import { formatPillNumber } from '$lib/domain/pill';

	let { data } = $props();

	type View = 'list' | 'grouped';
	let view = $state<View>('list');
	let filter = $state('Tutte');

	let cats = $derived(['Tutte', ...new Set(data.pills.map((p) => p.category?.name ?? '—'))]);
	let filtered = $derived(
		filter === 'Tutte' ? data.pills : data.pills.filter((p) => (p.category?.name ?? '—') === filter)
	);

	let grouped = $derived.by(() => {
		const groups = new Map<string, typeof data.pills>();
		for (const p of data.pills) {
			const key = p.category?.name ?? '—';
			const arr = groups.get(key) ?? [];
			arr.push(p);
			groups.set(key, arr);
		}
		return [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
	});
</script>

<section class="library">
	<div class="masthead">
		<div class="title-line headline">Biblioteca</div>
	</div>

	<div class="spaced-row">
		<p class="meta">{data.pills.length} pillole · {Math.max(0, cats.length - 1)} categorie</p>
	</div>

	<div class="view-toggle">
		{#each [{ id: 'list' as View, l: 'Cronologia' }, { id: 'grouped' as View, l: 'Per categoria' }] as v (v.id)}
			<button
				type="button"
				class="toggle-btn"
				class:active={view === v.id}
				onclick={() => (view = v.id)}
			>
				{v.l}
			</button>
		{/each}
	</div>

	{#if view === 'list'}
		<div class="cat-strip">
			{#each cats as c (c)}
				<button type="button" class="chip" aria-pressed={filter === c} onclick={() => (filter = c)}>
					{c}
				</button>
			{/each}
		</div>
	{/if}

	<div class="body">
		{#if view === 'list'}
			{#if filtered.length === 0}
				<p class="empty serif-italic">Nessuna pillola in questa categoria.</p>
			{:else}
				{#each filtered as p, i (p.id)}
					<PillListItem pill={p} first={i === 0} />
				{/each}
			{/if}
		{:else}
			<div class="groups">
				{#each grouped as [cat, items] (cat)}
					{@const color = items[0].category?.color ?? '#888'}
					<div class="group">
						<div class="group-head">
							<Capsule {color} size={20} />
							<div class="group-title serif">{cat}</div>
							<div class="group-count">{items.length}</div>
						</div>
						<div class="group-grid">
							{#each items as p (p.id)}
								<a href="/pills/{p.id}" class="grid-card card-paper">
									<div class="grid-num serif">№ {formatPillNumber(p.number)}</div>
									<div class="grid-title serif">{p.title}</div>
									<div class="grid-date">{formatDateShort(p.createdAt)}</div>
								</a>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>

<GoUp bottomOffset={120} />

<style>
	.library {
		padding: 22px var(--screen-pad, 24px) 60px;
	}

	.masthead {
		margin: 0 0 10px;
	}

	.spaced-row {
		margin: 0 0px 30px;
	}
	.meta {
		font-size: 13px;
		color: var(--color-ink-muted);
		margin: 8px 0 0;
		letter-spacing: 0.01em;
	}

	.view-toggle {
		display: flex;
		gap: 6px;
		margin-bottom: 14px;
	}

	.toggle-btn {
		font-size: 12px;
		padding: 7px 14px;
		border-radius: 9999px;
		border: 1px solid var(--color-ink-border);
		background: transparent;
		color: var(--color-ink);
		cursor: pointer;
		letter-spacing: 0.02em;
		font-weight: 500;
	}

	.toggle-btn.active {
		background: var(--color-ink);
		color: var(--color-paper);
		border-color: var(--color-ink);
	}

	.cat-strip {
		display: flex;
		gap: 6px;
		overflow-x: auto;
		margin: 6px -24px 10px;
		padding: 4px 24px 10px;
	}

	.chip {
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		font-weight: 600;
		flex-shrink: 0;
		border-color: var(--color-ink-border);
		background: var(--color-paper-card);
		color: var(--color-ink-muted);
	}

	.chip[aria-pressed='true'] {
		border-color: var(--color-accent);
		background: color-mix(in srgb, var(--color-accent) 8%, var(--color-paper));
		color: var(--color-accent);
	}

	.body {
		padding: 8px 24px 0;
	}

	.empty {
		padding: 40px 0;
		text-align: center;
		color: var(--color-ink-muted);
	}

	.groups {
		display: flex;
		flex-direction: column;
		gap: 24px;
		padding-top: 8px;
	}

	.group-head {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 12px;
	}

	.group-title {
		font-size: 22px;
		font-weight: 500;
		color: var(--color-ink);
		letter-spacing: -0.013em;
	}

	.group-count {
		font-size: 11px;
		color: var(--color-ink-subtle);
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.02em;
	}

	.group-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}

	.grid-card {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 14px 14px 16px;
		min-height: 140px;
		text-decoration: none;
		color: inherit;
	}

	.grid-num {
		font-size: 10px;
		color: var(--color-ink-subtle);
		letter-spacing: 0.05em;
		font-variant-numeric: tabular-nums;
	}

	.grid-title {
		font-size: 15px;
		line-height: 1.2;
		font-weight: 500;
		color: var(--color-ink);
		letter-spacing: -0.005em;
		text-wrap: balance;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.grid-date {
		margin-top: auto;
		font-size: 10px;
		color: var(--color-ink-subtle);
		letter-spacing: 0.03em;
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
</style>
