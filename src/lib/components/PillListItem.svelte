<script lang="ts">
	import type { PillWithCategory } from '$lib/domain/pill';
	import { formatPillNumber } from '$lib/domain/pill';
	import { formatDateShort } from '$lib/utils/format';

	type Props = {
		pill: PillWithCategory;
		first?: boolean;
	};

	let { pill, first = false }: Props = $props();
</script>

<a href="/pills/{pill.id}" class="row" class:first>
	<div class="num serif">№ {formatPillNumber(pill.number)}</div>
	<div class="content">
		<div class="meta">
			<span class="dot" style:background={pill.category?.color ?? '#888'}></span>
			<span class="cat">{pill.category?.name ?? '—'}</span>
		</div>
		<div class="title serif">{pill.title}</div>
		<div class="excerpt">{pill.excerpt}</div>
	</div>
	<div class="date">{formatDateShort(pill.createdAt)}</div>
</a>

<style>
	.row {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		padding: 16px 0;
		border-bottom: 1px solid var(--color-ink-border);
		text-decoration: none;
		color: inherit;
	}

	.row.first {
		border-top: 1px solid var(--color-ink-border);
	}

	.num {
		font-size: 12px;
		color: var(--color-ink-subtle);
		padding-top: 4px;
		font-variant-numeric: tabular-nums;
		min-width: 38px;
		letter-spacing: 0.03em;
	}

	.content {
		flex: 1;
		min-width: 0;
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 6px;
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 9999px;
	}

	.cat {
		font-size: 10px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-muted);
		font-weight: 600;
	}

	.title {
		font-size: 18px;
		line-height: 1.2;
		font-weight: 500;
		letter-spacing: -0.01em;
		color: var(--color-ink);
		margin-bottom: 6px;
		text-wrap: balance;
	}

	.excerpt {
		font-size: 13px;
		line-height: 1.5;
		color: var(--color-ink-muted);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.date {
		font-size: 11px;
		color: var(--color-ink-subtle);
		padding-top: 4px;
		white-space: nowrap;
		letter-spacing: 0.02em;
	}
</style>
