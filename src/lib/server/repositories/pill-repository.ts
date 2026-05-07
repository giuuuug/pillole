import { and, count, desc, eq, gte, ilike, max, or, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { db } from '$lib/server/db';
import { category, pill } from '$lib/server/db/schema';
import type {
	Pill,
	PillInput,
	PillSearchFilters,
	PillSummary,
	PillUpdate,
	PillWithCategory
} from '$lib/domain/pill';

type PillRow = typeof pill.$inferSelect;

function toDomain(row: PillRow): Pill {
	return {
		id: row.id,
		userId: row.userId,
		categoryId: row.categoryId,
		number: row.number,
		title: row.title,
		excerpt: row.excerpt,
		body: row.body,
		source: row.source,
		sourceUrl: row.sourceUrl,
		favorite: row.favorite,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt
	};
}

type JoinedRow = {
	pill: PillRow;
	category: typeof category.$inferSelect | null;
};

function toDomainJoined(row: JoinedRow): PillWithCategory {
	return {
		...toDomain(row.pill),
		category: row.category
			? { id: row.category.id, name: row.category.name, color: row.category.color }
			: null
	};
}

type SummaryRow = {
	pill: Omit<PillRow, 'body'>;
	category: typeof category.$inferSelect | null;
};

function toDomainSummary(row: SummaryRow): PillSummary {
	return {
		id: row.pill.id,
		userId: row.pill.userId,
		categoryId: row.pill.categoryId,
		number: row.pill.number,
		title: row.pill.title,
		excerpt: row.pill.excerpt,
		source: row.pill.source,
		sourceUrl: row.pill.sourceUrl,
		favorite: row.pill.favorite,
		createdAt: row.pill.createdAt,
		updatedAt: row.pill.updatedAt,
		category: row.category
			? { id: row.category.id, name: row.category.name, color: row.category.color }
			: null
	};
}

const summaryColumns = {
	pill: {
		id: pill.id,
		userId: pill.userId,
		categoryId: pill.categoryId,
		number: pill.number,
		title: pill.title,
		excerpt: pill.excerpt,
		source: pill.source,
		sourceUrl: pill.sourceUrl,
		favorite: pill.favorite,
		createdAt: pill.createdAt,
		updatedAt: pill.updatedAt
	},
	category
} as const;

function periodCutoff(period: 'week' | 'month'): Date {
	const d = new Date();
	if (period === 'week') d.setDate(d.getDate() - 7);
	else d.setMonth(d.getMonth() - 1);
	return d;
}

export const pillRepository = {
	async listByUser(userId: string): Promise<PillWithCategory[]> {
		const rows = await db
			.select({ pill, category })
			.from(pill)
			.leftJoin(category, eq(pill.categoryId, category.id))
			.where(eq(pill.userId, userId))
			.orderBy(desc(pill.createdAt));
		return rows.map(toDomainJoined);
	},

	async findById(userId: string, id: string): Promise<PillWithCategory | null> {
		const [row] = await db
			.select({ pill, category })
			.from(pill)
			.leftJoin(category, eq(pill.categoryId, category.id))
			.where(and(eq(pill.userId, userId), eq(pill.id, id)))
			.limit(1);
		return row ? toDomainJoined(row) : null;
	},

	async count(userId: string): Promise<number> {
		const [row] = await db
			.select({ value: count() })
			.from(pill)
			.where(eq(pill.userId, userId));
		return row?.value ?? 0;
	},

	// Fetches a single pill at positional offset (DESC createdAt) — used for daily pill.
	async findByOffset(userId: string, offset: number): Promise<PillWithCategory | null> {
		const [row] = await db
			.select({ pill, category })
			.from(pill)
			.leftJoin(category, eq(pill.categoryId, category.id))
			.where(eq(pill.userId, userId))
			.orderBy(desc(pill.createdAt))
			.limit(1)
			.offset(offset);
		return row ? toDomainJoined(row) : null;
	},

	async listAllSummary(userId: string): Promise<PillSummary[]> {
		const rows = await db
			.select(summaryColumns)
			.from(pill)
			.leftJoin(category, eq(pill.categoryId, category.id))
			.where(eq(pill.userId, userId))
			.orderBy(desc(pill.createdAt));
		return rows.map(toDomainSummary);
	},

	async listSummaryPaginated(
		userId: string,
		limit: number,
		offset: number
	): Promise<PillSummary[]> {
		const rows = await db
			.select(summaryColumns)
			.from(pill)
			.leftJoin(category, eq(pill.categoryId, category.id))
			.where(eq(pill.userId, userId))
			.orderBy(desc(pill.createdAt))
			.limit(limit)
			.offset(offset);
		return rows.map(toDomainSummary);
	},

	async searchSummary(
		userId: string,
		filters: PillSearchFilters,
		limit: number,
		offset: number
	): Promise<PillSummary[]> {
		const conditions = [eq(pill.userId, userId)];

		if (filters.query) {
			const term = `%${filters.query}%`;
			conditions.push(
				or(ilike(pill.title, term), ilike(pill.excerpt, term), ilike(pill.body, term))!
			);
		}
		if (filters.categoryId !== undefined && filters.categoryId !== null) {
			conditions.push(eq(pill.categoryId, filters.categoryId));
		}
		if (filters.period && filters.period !== 'any') {
			conditions.push(gte(pill.createdAt, periodCutoff(filters.period)));
		}

		const rows = await db
			.select(summaryColumns)
			.from(pill)
			.leftJoin(category, eq(pill.categoryId, category.id))
			.where(and(...conditions))
			.orderBy(desc(pill.createdAt))
			.limit(limit)
			.offset(offset);
		return rows.map(toDomainSummary);
	},

	async countByFilters(userId: string, filters: PillSearchFilters): Promise<number> {
		const conditions = [eq(pill.userId, userId)];

		if (filters.query) {
			const term = `%${filters.query}%`;
			conditions.push(
				or(ilike(pill.title, term), ilike(pill.excerpt, term), ilike(pill.body, term))!
			);
		}
		if (filters.categoryId !== undefined && filters.categoryId !== null) {
			conditions.push(eq(pill.categoryId, filters.categoryId));
		}
		if (filters.period && filters.period !== 'any') {
			conditions.push(gte(pill.createdAt, periodCutoff(filters.period)));
		}

		const [row] = await db
			.select({ value: count() })
			.from(pill)
			.where(and(...conditions));
		return row?.value ?? 0;
	},

	async nextNumber(userId: string): Promise<number> {
		const [row] = await db
			.select({ max: max(pill.number) })
			.from(pill)
			.where(eq(pill.userId, userId));
		return (row?.max ?? 0) + 1;
	},

	async create(userId: string, input: PillInput, number: number): Promise<Pill> {
		const id = nanoid();
		const [row] = await db
			.insert(pill)
			.values({
				id,
				userId,
				number,
				title: input.title,
				excerpt: input.excerpt ?? '',
				body: input.body,
				categoryId: input.categoryId,
				source: input.source ?? null,
				sourceUrl: input.sourceUrl ?? null,
				favorite: input.favorite ?? false
			})
			.returning();
		return toDomain(row);
	},

	async update(userId: string, id: string, patch: PillUpdate): Promise<Pill | null> {
		const set: Record<string, unknown> = {};
		if (patch.title !== undefined) set.title = patch.title;
		if (patch.body !== undefined) set.body = patch.body;
		if (patch.excerpt !== undefined) set.excerpt = patch.excerpt;
		if (patch.categoryId !== undefined) set.categoryId = patch.categoryId;
		if (patch.source !== undefined) set.source = patch.source;
		if (patch.sourceUrl !== undefined) set.sourceUrl = patch.sourceUrl;
		if (patch.favorite !== undefined) set.favorite = patch.favorite;
		if (Object.keys(set).length === 0) return this.findById(userId, id).then((p) => p);
		const [row] = await db
			.update(pill)
			.set(set)
			.where(and(eq(pill.userId, userId), eq(pill.id, id)))
			.returning();
		return row ? toDomain(row) : null;
	},

	async remove(userId: string, id: string): Promise<void> {
		await db.delete(pill).where(and(eq(pill.userId, userId), eq(pill.id, id)));
	},

	async toggleFavorite(userId: string, id: string): Promise<Pill | null> {
		const [row] = await db
			.update(pill)
			.set({ favorite: sql`NOT ${pill.favorite}` })
			.where(and(eq(pill.userId, userId), eq(pill.id, id)))
			.returning();
		return row ? toDomain(row) : null;
	}
};
