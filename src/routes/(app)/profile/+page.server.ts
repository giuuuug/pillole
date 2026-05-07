import type { PageServerLoad } from './$types';
import { pillService } from '$lib/server/services/pill-service';

export const load: PageServerLoad = async ({ locals }) => {
	const pills = await pillService.listAllSummary(locals.user!.id);
	return { pills };
};
