import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export function formatDateShort(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return format(d, 'd MMM', { locale: it });
}

export function formatDateLong(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return format(d, "d MMMM yyyy", { locale: it });
}

export function formatToday(date = new Date()): string {
	return format(date, 'EEEE, d MMMM', { locale: it });
}
