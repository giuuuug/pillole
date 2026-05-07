import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pillRepository } from '$lib/server/repositories/pill-repository';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) throw error(401, 'Non autorizzato');
	const items = await pillRepository.listAllSummary(locals.user.id);
	return json({ items });
};
