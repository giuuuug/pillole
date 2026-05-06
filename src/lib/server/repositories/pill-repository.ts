import { and, desc, eq, max, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { db } from '$lib/server/db';
import { category, pill } from '$lib/server/db/schema';
import type { Pill, PillInput, PillUpdate, PillWithCategory } from '$lib/domain/pill';

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
