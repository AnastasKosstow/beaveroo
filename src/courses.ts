export type Lang = 'bg' | 'en';
export type Localized = Record<Lang, string>;

export type ModuleTrack = 'fast' | 'deep';
export type ModuleStatus = 'ready' | 'upcoming';

export interface CourseModule {
	id: string;
	number: string;
	slug?: string;
	title: Localized;
	tagline: Localized;
	minutes: number;
	track: ModuleTrack;
	status: ModuleStatus;
}

export interface Course {
	id: string;
	slug: string;
	emoji: string;
	title: Localized;
	subtitle: Localized;
	description: Localized;
	meta: Localized;
	homeHref: string;
	startHref: string;
	audience?: Localized;
	lead?: Localized;
	modules?: CourseModule[];
}

export const agentsCourse: Course = {
	id: 'agents-course',
	slug: '',
	emoji: '🤗',
	title: { bg: 'AI Agents Course', en: 'AI Agents Course' },
	subtitle: {
		bg: 'Hugging Face Agents Course на български — с C# / .NET примери',
		en: 'The Hugging Face Agents Course — adapted with C# / .NET examples',
	},
	description: {
		bg: 'Научи как да изграждаш и публикуваш свои собствени AI agents',
		en: 'Learn to build and deploy your own AI agents.',
	},
	meta: { bg: '2 units · C# / .NET', en: '2 units · C# / .NET' },
	homeHref: 'unit-0/introduction/',
	startHref: 'unit-0/introduction/',
};

export const pythonForDotnetCourse: Course = {
	id: 'python-for-dotnet',
	slug: 'python-for-dotnet',
	emoji: '🐍',
	title: { bg: 'Python for .NET Developers', en: 'Python for .NET Developers' },
	subtitle: {
		bg: 'От C# към Python — без да учиш програмирането отначало',
		en: 'From C# to Python — without relearning programming',
	},
	description: {
		bg: 'Кратък, целенасочен курс по Python за опитни C#/.NET разработчици: side-by-side сравнения, семантични разлики и упражнения в браузъра.',
		en: 'A short, focused Python course for experienced C#/.NET developers: side-by-side comparisons, semantic differences and in-browser exercises.',
	},
	meta: {
		bg: '11 модула · ~4 ч 35 мин · Python / C#',
		en: '11 modules · ~4h 35min · Python / C#',
	},
	homeHref: 'python-for-dotnet/',
	startHref: 'python-for-dotnet/unit-00-setup/',
	audience: {
		bg: 'За опитни C#/.NET разработчици',
		en: 'Built for experienced C#/.NET developers',
	},
	lead: {
		bg: 'Ти вече знаеш софтуерното инженерство. Този курс не обяснява какво е променлива — свързва всяко Python понятие с познат C# модел, показва какво реално се променя в семантиката и те оставя да го изпробваш веднага: в браузъра и локално във VS Code.',
		en: 'You already know software engineering. This course will not explain what a variable is — it maps every Python concept to a C# model you know, shows what actually changes in the semantics, and lets you try it immediately: in the browser and locally in VS Code.',
	},
	modules: [
		{
			id: 'unit-00',
			number: '00',
			slug: 'unit-00-setup',
			title: { bg: 'Python Setup & First Script', en: 'Python Setup & First Script' },
			tagline: {
				bg: 'От нула до изпълнен и дебъгнат скрипт',
				en: 'From zero to a running, debugged script',
			},
			minutes: 20,
			track: 'fast',
			status: 'ready',
		},
		{
			id: 'unit-01',
			number: '01',
			title: { bg: 'Python Syntax for C# Developers', en: 'Python Syntax for C# Developers' },
			tagline: {
				bg: 'Indentation вместо скоби, None, f-strings, match',
				en: 'Indentation instead of braces, None, f-strings, match',
			},
			minutes: 20,
			track: 'fast',
			status: 'upcoming',
		},
		{
			id: 'unit-02',
			number: '02',
			title: { bg: 'Functions, Modules & Imports', en: 'Functions, Modules & Imports' },
			tagline: {
				bg: 'def, *args / **kwargs, модули и __main__',
				en: 'def, *args / **kwargs, modules and __main__',
			},
			minutes: 25,
			track: 'fast',
			status: 'upcoming',
		},
		{
			id: 'unit-03',
			number: '03',
			title: { bg: 'Types & Collections', en: 'Types & Collections' },
			tagline: {
				bg: 'Динамични типове, list / tuple / dict / set, mutability',
				en: 'Dynamic typing, list / tuple / dict / set, mutability',
			},
			minutes: 25,
			track: 'fast',
			status: 'upcoming',
		},
		{
			id: 'unit-04',
			number: '04',
			title: { bg: 'LINQ → Pythonic Collections', en: 'LINQ → Pythonic Collections' },
			tagline: {
				bg: 'Comprehensions, generators, eager срещу lazy',
				en: 'Comprehensions, generators, eager vs lazy',
			},
			minutes: 30,
			track: 'fast',
			status: 'upcoming',
		},
		{
			id: 'unit-05',
			number: '05',
			title: { bg: 'Classes & OOP', en: 'Classes & OOP' },
			tagline: {
				bg: 'class, self, @dataclass срещу record',
				en: 'class, self, @dataclass vs record',
			},
			minutes: 25,
			track: 'fast',
			status: 'upcoming',
		},
		{
			id: 'unit-06',
			number: '06',
			title: { bg: 'Python Gotchas for C# Developers', en: 'Python Gotchas for C# Developers' },
			tagline: {
				bg: 'Mutable defaults, == срещу is, truthiness, копиране',
				en: 'Mutable defaults, == vs is, truthiness, copying',
			},
			minutes: 20,
			track: 'fast',
			status: 'upcoming',
		},
		{
			id: 'unit-07',
			number: '07',
			title: { bg: 'Exceptions, Files & HTTP', en: 'Exceptions, Files & HTTP' },
			tagline: {
				bg: 'try / except, with, pathlib, JSON, HTTP заявки',
				en: 'try / except, with, pathlib, JSON, HTTP requests',
			},
			minutes: 30,
			track: 'fast',
			status: 'upcoming',
		},
		{
			id: 'unit-08',
			number: '08',
			title: { bg: 'Type Hints & Modern Tooling', en: 'Type Hints & Modern Tooling' },
			tagline: {
				bg: 'Hints без runtime enforcement, Pyright, Ruff, uv',
				en: 'Hints without runtime enforcement, Pyright, Ruff, uv',
			},
			minutes: 20,
			track: 'fast',
			status: 'upcoming',
		},
		{
			id: 'unit-09',
			number: '09',
			title: { bg: 'Testing & Debugging', en: 'Testing & Debugging' },
			tagline: {
				bg: 'pytest, fixtures, mocking, debugger',
				en: 'pytest, fixtures, mocking, debugger',
			},
			minutes: 20,
			track: 'fast',
			status: 'upcoming',
		},
		{
			id: 'unit-10',
			number: '10',
			title: { bg: 'Final Project', en: 'Final Project' },
			tagline: {
				bg: 'API Data Processor — Python CLI с тестове',
				en: 'API Data Processor — a Python CLI with tests',
			},
			minutes: 40,
			track: 'fast',
			status: 'upcoming',
		},
		{
			id: 'unit-11',
			number: '11',
			title: { bg: 'Async & Concurrency', en: 'Async & Concurrency' },
			tagline: {
				bg: 'asyncio, coroutines, Task срещу coroutine',
				en: 'asyncio, coroutines, Task vs coroutine',
			},
			minutes: 30,
			track: 'deep',
			status: 'upcoming',
		},
		{
			id: 'unit-12',
			number: '12',
			title: { bg: 'Advanced Python Patterns', en: 'Advanced Python Patterns' },
			tagline: {
				bg: 'Protocol, ABC, decorators, context managers',
				en: 'Protocol, ABC, decorators, context managers',
			},
			minutes: 40,
			track: 'deep',
			status: 'upcoming',
		},
	],
};

export const courses: Course[] = [agentsCourse, pythonForDotnetCourse];

export function langOf(locale: string | undefined): Lang {
	return locale === 'en' ? 'en' : 'bg';
}

export function localeBase(locale: string | undefined): string {
	return locale ? `/${locale}/` : '/';
}

export function stripLocale(pathname: string): string {
	const match = pathname.match(/^\/en(?=\/|$)/);
	return match ? pathname.slice(match[0].length) || '/' : pathname;
}

export function getCourseForPath(pathname: string): Course {
	const path = stripLocale(pathname);
	return (
		courses.find(
			(course) => course.slug !== '' && (path === `/${course.slug}` || path.startsWith(`/${course.slug}/`))
		) ?? courses[0]!
	);
}

export function getCourseById(id: string | undefined): Course | undefined {
	return courses.find((course) => course.id === id);
}

export function moduleHref(course: Course, module: CourseModule, locale: string | undefined): string | undefined {
	if (!module.slug) return undefined;
	return `${localeBase(locale)}${course.slug}/${module.slug}/`;
}

export function trackMinutes(course: Course, track: ModuleTrack): number {
	return (course.modules ?? [])
		.filter((module) => module.track === track)
		.reduce((sum, module) => sum + module.minutes, 0);
}

export function formatDuration(minutes: number, lang: Lang): string {
	const hours = Math.floor(minutes / 60);
	const rest = minutes % 60;
	if (lang === 'en') {
		if (hours === 0) return `${rest}min`;
		return rest === 0 ? `${hours}h` : `${hours}h ${rest}min`;
	}
	if (hours === 0) return `${rest} мин`;
	return rest === 0 ? `${hours} ч` : `${hours} ч ${rest} мин`;
}
