import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pillService } from '$lib/server/services/pill-service';
import type { PillSearchFilters } from '$lib/domain/pill';

export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.user) throw error(401, 'Non autorizzato');

	const query = url.searchParams.get('q')?.trim() || undefined;
	const categoryId = url.searchParams.get('category') ?? undefined;
	const rawPeriod = url.searchParams.get('period');
	const period =
		rawPeriod === 'week' || rawPeriod === 'month' ? rawPeriod : ('any' as const);
	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));

	const filters: PillSearchFilters = { query, categoryId, period };
	const result = await pillService.searchPaginated(locals.user.id, filters, page);
	return json(result);
};
