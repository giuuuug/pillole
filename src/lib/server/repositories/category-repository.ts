import { and, asc, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { db } from '$lib/server/db';
import { category } from '$lib/server/db/schema';
import type { Category, CategoryInput } from '$lib/domain/category';

function toDomain(row: typeof category.$inferSelect): Category {
	return {
		id: row.id,
		userId: row.userId,
		name: row.name,
		color: row.color,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt
	};
}

export const categoryRepository = {
	async listByUser(userId: string): Promise<Category[]> {
		const rows = await db
			.select()
			.from(category)
			.where(eq(category.userId, userId))
			.orderBy(asc(category.name));
		return rows.map(toDomain);
	},

	async findById(userId: string, id: string): Promise<Category | null> {
		const [row] = await db
			.select()
			.from(category)
			.where(and(eq(category.userId, userId), eq(category.id, id)))
			.limit(1);
		return row ? toDomain(row) : null;
	},

	async findByName(userId: string, name: string): Promise<Category | null> {
		const [row] = await db
			.select()
			.from(category)
			.where(and(eq(category.userId, userId), eq(category.name, name)))
			.limit(1);
		return row ? toDomain(row) : null;
	},

	async create(userId: string, input: CategoryInput): Promise<Category> {
		const id = nanoid();
		const [row] = await db
			.insert(category)
			.values({ id, userId, name: input.name, color: input.color })
			.returning();
		return toDomain(row);
	},

	async createMany(userId: string, inputs: CategoryInput[]): Promise<Category[]> {
		if (inputs.length === 0) return [];
		const rows = await db
			.insert(category)
			.values(inputs.map((c) => ({ id: nanoid(), userId, name: c.name, color: c.color })))
			.returning();
		return rows.map(toDomain);
	},

	async update(
		userId: string,
		id: string,
		patch: Partial<CategoryInput>
	): Promise<Category | null> {
		const [row] = await db
			.update(category)
			.set(patch)
			.where(and(eq(category.userId, userId), eq(category.id, id)))
			.returning();
		return row ? toDomain(row) : null;
	},

	async remove(userId: string, id: string): Promise<void> {
		await db.delete(category).where(and(eq(category.userId, userId), eq(category.id, id)));
	}
};
