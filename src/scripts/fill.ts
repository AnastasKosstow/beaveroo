/** Fills a template such as `{done} от {total} урока`. Unknown placeholders are left as they are. */
export function fill(template: string, values: Record<string, string | number>): string {
	return template.replace(/\{(\w+)\}/g, (match, name: string) => String(values[name] ?? match));
}
