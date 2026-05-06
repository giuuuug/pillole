import { pillRepository } from '$lib/server/repositories/pill-repository';
import { categoryRepository } from '$lib/server/repositories/category-repository';
import { buildExcerpt, type Pill, type PillInput, type PillWithCategory } from '$lib/domain/pill';

export class PillServiceError extends Error {
	constructor(
		public code: 'INVALID' | 'NOT_FOUND',
		message: string
	) {
		super(message);
	}
}

function isSafeUrl(url: string): boolean {
	try {
		const { protocol } = new URL(url);
		return protocol === 'https:' || protocol === 'http:';
	} catch {
		return false;
	}
}

function validate(input: PillInput) {
	const title = input.title.trim();
	const body = input.body.trim();
	if (title.length === 0)
		throw new PillServiceError('INVALID', 'Il titolo non può essere vuoto.');
	if (title.length > 200)
		throw new PillServiceError('INVALID', 'Il titolo è troppo lungo (max 200).');
	if (body.length === 0) throw new PillServiceError('INVALID', 'Il corpo non può essere vuoto.');
	if (input.sourceUrl && !isSafeUrl(input.sourceUrl))
		throw new PillServiceError('INVALID', 'URL della fonte non valido.');
	return { title, body };
}

export const pillService = {
	async list(userId: string): Promise<PillWithCategory[]> {
		return pillRepository.listByUser(userId);
	},

	async findById(userId: string, id: string): Promise<PillWithCategory> {
		const row = await pillRepository.findById(userId, id);
		if (!row) throw new PillServiceError('NOT_FOUND', 'Pillola non trovata.');
		return row;
	},

	async create(userId: string, input: PillInput): Promise<Pill> {
		const { title, body } = validate(input);

		if (input.categoryId) {
			const cat = await categoryRepository.findById(userId, input.categoryId);
			if (!cat) throw new PillServiceError('INVALID', 'Categoria non valida.');
		}

		const number = await pillRepository.nextNumber(userId);
		return pillRepository.create(
			userId,
			{
				title,
				body,
				excerpt: input.excerpt?.trim() || buildExcerpt(body),
				categoryId: input.categoryId,
				source: input.source?.trim() || null,
				sourceUrl: input.sourceUrl?.trim() || null,
				favorite: input.favorite ?? false
			},
			number
		);
	},

	async update(userId: string, id: string, patch: Partial<PillInput>): Promise<Pill> {
		const set: Partial<PillInput> = {};
		if (patch.title !== undefined) set.title = patch.title.trim();
		if (patch.body !== undefined) {
			set.body = patch.body.trim();
			if (patch.excerpt === undefined) set.excerpt = buildExcerpt(set.body);
		}
		if (patch.excerpt !== undefined) set.excerpt = patch.excerpt.trim();
		if (patch.categoryId !== undefined) {
			if (patch.categoryId !== null) {
				const cat = await categoryRepository.findById(userId, patch.categoryId);
				if (!cat) throw new PillServiceError('INVALID', 'Categoria non valida.');
			}
			set.categoryId = patch.categoryId;
		}
		if (patch.source !== undefined) set.source = patch.source?.trim() || null;
		if (patch.sourceUrl !== undefined) {
			const url = patch.sourceUrl?.trim() || null;
			if (url && !isSafeUrl(url)) throw new PillServiceError('INVALID', 'URL della fonte non valido.');
			set.sourceUrl = url;
		}
		if (patch.favorite !== undefined) set.favorite = patch.favorite;

		const row = await pillRepository.update(userId, id, set);
		if (!row) throw new PillServiceError('NOT_FOUND', 'Pillola non trovata.');
		return row;
	},

	async toggleFavorite(userId: string, id: string): Promise<Pill> {
		const row = await pillRepository.toggleFavorite(userId, id);
		if (!row) throw new PillServiceError('NOT_FOUND', 'Pillola non trovata.');
		return row;
	},

	async remove(userId: string, id: string): Promise<void> {
		await pillRepository.remove(userId, id);
	}
};
