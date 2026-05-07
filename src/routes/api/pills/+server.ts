import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pillService } from '$lib/server/services/pill-service';

export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.user) throw error(401, 'Non autorizzato');

	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
	const pageSize = Math.min(100, Math.max(1, parseInt(url.searchParams.get('pageSize') ?? '30')));

	const result = await pillService.listPaginated(locals.user.id, page, pageSize);
	return json(result);
};
