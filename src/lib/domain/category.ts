export type Category = {
	id: string;
	userId: string;
	name: string;
	color: string;
	createdAt: Date;
	updatedAt: Date;
};

export type CategoryInput = {
	name: string;
	color: string;
};

export const DEFAULT_CATEGORY_PALETTE: ReadonlyArray<string> = [
	'#7B6FA8',
	'#B85C5C',
	'#B8853E',
	'#4A6FA5',
	'#5C8B6E',
	'#8B6F47',
	'#6B8E5A',
	'#A0664B',
	'#3B6B7C',
	'#7A5BA1',
	'#C97A7A',
	'#5E8FA8'
] as const;

export const SEED_CATEGORIES: ReadonlyArray<CategoryInput> = [
	{ name: 'Psicologia', color: '#7B6FA8' },
	{ name: 'Medicina', color: '#B85C5C' },
	{ name: 'Etimologia', color: '#B8853E' },
	{ name: 'Fisica', color: '#4A6FA5' },
	{ name: 'Sociologia', color: '#5C8B6E' },
	{ name: 'Filosofia', color: '#8B6F47' },
	{ name: 'Biologia', color: '#6B8E5A' },
	{ name: 'Storia', color: '#A0664B' },
	{ name: 'Ingegneria', color: '#3B6B7C' },
	{ name: 'Matematica', color: '#7A5BA1' }
] as const;

export const FALLBACK_CATEGORY_COLOR = '#888888';

export function categoryColor(
	categoryId: string | null | undefined,
	categories: Pick<Category, 'id' | 'color'>[]
): string {
	if (!categoryId) return FALLBACK_CATEGORY_COLOR;
	return categories.find((c) => c.id === categoryId)?.color ?? FALLBACK_CATEGORY_COLOR;
}

export function categoryName(
	categoryId: string | null | undefined,
	categories: Pick<Category, 'id' | 'name'>[]
): string {
	if (!categoryId) return '—';
	return categories.find((c) => c.id === categoryId)?.name ?? '—';
}
