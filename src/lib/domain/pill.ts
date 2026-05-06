import type { Category } from './category';

export type Pill = {
	id: string;
	userId: string;
	categoryId: string | null;
	number: number;
	title: string;
	excerpt: string;
	body: string;
	source: string | null;
	sourceUrl: string | null;
	favorite: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export type PillWithCategory = Pill & {
	category: Pick<Category, 'id' | 'name' | 'color'> | null;
};

export type PillInput = {
	title: string;
	body: string;
	excerpt?: string;
	categoryId: string | null;
	source?: string | null;
	sourceUrl?: string | null;
	favorite?: boolean;
};

export type PillUpdate = Partial<PillInput> & { favorite?: boolean };

export type PillSearchFilters = {
	query?: string;
	categoryId?: string | null;
	period?: 'any' | 'week' | 'month';
};

export function formatPillNumber(n: number): string {
	return String(n).padStart(3, '0');
}

export function buildExcerpt(body: string, max = 180): string {
	const firstLine = body.split('\n').find((l) => l.trim().length > 0) ?? '';
	const trimmed = firstLine.trim();
	if (trimmed.length <= max) return trimmed;
	return trimmed.slice(0, max - 1).trimEnd() + '…';
}

export function pickDailyPill<T extends { id: string }>(pills: T[], date = new Date()): T | null {
	if (pills.length === 0) return null;
	const seed = date.getFullYear() * 1000 + (date.getMonth() + 1) * 50 + date.getDate();
	return pills[seed % pills.length];
}
