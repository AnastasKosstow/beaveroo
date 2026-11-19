export interface Course {
	/** First path segment of every page in the course, for example `ai-agents`. */
	id: string;
	/** i18n key of the course name. Used in the sidebar and on the home page card. */
	title: keyof StarlightApp.I18n;
	/** Show the Hugging Face links in the header and the footer on the pages of this course. */
	huggingFace?: boolean;
	/** Progress tracking in percent. Leave it out for a course that has no tracked lessons. */
	progress?: {
		/** How many lessons the finished course will have. */
		planned: number;
		/** Slugs of the published lessons, in reading order, without a locale prefix. */
		lessons: string[];
	};
}

export const courses: Course[] = [
	{
		id: 'ai-agents',
		title: 'course.title',
		huggingFace: true,
	},
	{
		id: 'python-for-dotnet',
		title: 'python.title',
		progress: {
			planned: 9,
			lessons: ['python-for-dotnet/unit-1/types-and-data'],
		},
	},
];

/** Turns a route id such as `en/ai-agents/unit-1/tools` into the slug shared by every locale. */
export function slugOf(id: string, locale: string | undefined): string {
	if (!locale) return id;
	if (id === locale) return '';
	return id.startsWith(`${locale}/`) ? id.slice(locale.length + 1) : id;
}

/** The course a slug belongs to. Pages outside a course, such as the home page, have none. */
export function courseOf(slug: string): Course | undefined {
	const [first] = slug.split('/');
	return courses.find((course) => course.id === first);
}
