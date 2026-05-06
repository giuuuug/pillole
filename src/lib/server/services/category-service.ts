import { categoryRepository } from '$lib/server/repositories/category-repository';
import { SEED_CATEGORIES, type Category, type CategoryInput } from '$lib/domain/category';

export class CategoryServiceError extends Error {
	constructor(
		public code: 'INVALID' | 'DUPLICATE' | 'NOT_FOUND',
		message: string
	) {
		super(message);
	}
}

function validate(input: CategoryInput) {
	const name = input.name.trim();
	if (name.length === 0) throw new CategoryServiceError('INVALID', 'Il nome non può essere vuoto.');
	if (name.length > 60)
		throw new CategoryServiceError('INVALID', 'Il nome è troppo lungo (max 60).');
	if (!/^#[0-9A-Fa-f]{6}$/.test(input.color))
		throw new CategoryServiceError('INVALID', 'Colore non valido.');
	return { name, color: input.color };
}

export const categoryService = {
	async list(userId: string): Promise<Category[]> {
		return categoryRepository.listByUser(userId);
	},

	async ensureSeeded(userId: string): Promise<Category[]> {
		const existing = await categoryRepository.listByUser(userId);
		if (existing.length > 0) return existing;
		return categoryRepository.createMany(userId, SEED_CATEGORIES.map((c) => ({ ...c })));
	},

	async create(userId: string, input: CategoryInput): Promise<Category> {
		const data = validate(input);
		const dup = await categoryRepository.findByName(userId, data.name);
		if (dup) throw new CategoryServiceError('DUPLICATE', 'Categoria già esistente.');
		return categoryRepository.create(userId, data);
	},

	async findOrCreate(userId: string, input: CategoryInput): Promise<Category> {
		const data = validate(input);
		const existing = await categoryRepository.findByName(userId, data.name);
		if (existing) return existing;
		return categoryRepository.create(userId, data);
	},

	async findById(userId: string, id: string): Promise<Category | null> {
		return categoryRepository.findById(userId, id);
	},

	async update(userId: string, id: string, patch: Partial<CategoryInput>): Promise<Category> {
		const set: Partial<CategoryInput> = {};
		if (patch.name !== undefined) {
			const name = patch.name.trim();
			if (name.length === 0)
				throw new CategoryServiceError('INVALID', 'Il nome non può essere vuoto.');
			set.name = name;
		}
		if (patch.color !== undefined) {
			if (!/^#[0-9A-Fa-f]{6}$/.test(patch.color))
				throw new CategoryServiceError('INVALID', 'Colore non valido.');
			set.color = patch.color;
		}
		const row = await categoryRepository.update(userId, id, set);
		if (!row) throw new CategoryServiceError('NOT_FOUND', 'Categoria non trovata.');
		return row;
	},

	async remove(userId: string, id: string): Promise<void> {
		await categoryRepository.remove(userId, id);
	}
};
