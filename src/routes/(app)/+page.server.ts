import type { PageServerLoad } from './$types';
import { pickDailyPill } from '$lib/domain/pill';

export const load: PageServerLoad = async ({ parent }) => {
	const { pills } = await parent();
	const daily = pickDailyPill(pills);
	return {
		totalCount: pills.length,
		daily
	};
};
