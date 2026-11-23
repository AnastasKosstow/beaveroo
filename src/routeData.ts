import { defineRouteMiddleware, type StarlightRouteData } from '@astrojs/starlight/route-data';
import { courseOf, slugOf } from './courses';

type SidebarEntry = StarlightRouteData['sidebar'][number];

function hrefs(entries: SidebarEntry[]): string[] {
	return entries.flatMap((entry) => (entry.type === 'link' ? [entry.href] : hrefs(entry.entries)));
}

/**
 * The sidebar in `astro.config.mjs` lists the units of every course.
 * A page shows only the units of its own course, and its previous and next links stay inside that course.
 */
export const onRequest = defineRouteMiddleware((context) => {
	const route = context.locals.starlightRoute;
	const course = courseOf(slugOf(route.id, route.locale));
	if (!course) return;

	const prefix = `${route.locale ? `/${route.locale}` : ''}/${course.id}/`;
	route.sidebar = route.sidebar.filter((entry) => hrefs([entry]).some((href) => href.startsWith(prefix)));

	const own = new Set(hrefs(route.sidebar));
	const { pagination } = route;
	if (pagination.prev && !own.has(pagination.prev.href)) pagination.prev = undefined;
	if (pagination.next && !own.has(pagination.next.href)) pagination.next = undefined;
});
