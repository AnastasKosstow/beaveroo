/**
 * Lesson progress, kept in the browser. There are no accounts and nothing is sent anywhere.
 *
 * A lesson is identified by its slug without a locale, so the Bulgarian and the English page share one record.
 * A lesson's percentage is the share of its checkpoints that are done. A checkpoint is a `<Question id="...">`.
 */

const STORAGE_KEY = 'beaveroo:progress:v1';
const CHANGE_EVENT = 'hf:progress';

interface LessonRecord {
	done: string[];
	total: number;
}

type Store = Record<string, LessonRecord>;

function read(): Store {
	try {
		const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
		return parsed && typeof parsed === 'object' ? (parsed as Store) : {};
	} catch {
		return {};
	}
}

let store = read();

function commit(): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
	} catch {
		// Storage is blocked or full. Progress still works until the page is closed.
	}
	document.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

window.addEventListener('storage', (event) => {
	if (event.key !== STORAGE_KEY) return;
	store = read();
	document.dispatchEvent(new CustomEvent(CHANGE_EVENT));
});

/** Runs `listener` every time progress changes, in this tab or in another one. */
export function onProgress(listener: () => void): void {
	document.addEventListener(CHANGE_EVENT, listener);
}

export interface LessonState {
	done: number;
	total: number;
	percent: number;
}

export function lessonState(lesson: string): LessonState {
	const record = store[lesson];
	if (!record || record.total <= 0) return { done: 0, total: 0, percent: 0 };
	const done = Math.min(record.done.length, record.total);
	return { done, total: record.total, percent: Math.round((done / record.total) * 100) };
}

export function isDone(lesson: string, checkpoint: string): boolean {
	return store[lesson]?.done.includes(checkpoint) ?? false;
}

/** Called by the lesson page with the checkpoints it contains. Keeps the record in step with the content. */
export function registerLesson(lesson: string, checkpoints: string[]): void {
	const before = store[lesson];
	const done = (before?.done ?? []).filter((id) => checkpoints.includes(id));
	if (before && before.total === checkpoints.length && before.done.length === done.length) return;
	store[lesson] = { done, total: checkpoints.length };
	commit();
}

export function completeCheckpoint(lesson: string, checkpoint: string): void {
	const record = store[lesson];
	if (!record || record.done.includes(checkpoint)) return;
	record.done.push(checkpoint);
	commit();
}

export function resetLesson(lesson: string): void {
	const record = store[lesson];
	if (!record || record.done.length === 0) return;
	record.done = [];
	commit();
}

export interface CourseState {
	/** Lessons at 100%. */
	completed: number;
	percent: number;
}

/** Progress over the whole course. Lessons that are not published yet count as 0%. */
export function courseState(lessons: string[], planned: number): CourseState {
	const states = lessons.map(lessonState);
	const sum = states.reduce((total, state) => total + state.percent, 0);
	return {
		completed: states.filter((state) => state.percent === 100).length,
		percent: planned > 0 ? Math.round(sum / planned) : 0,
	};
}

/** Turns a link such as `/en/python-for-dotnet/unit-1/types-and-data/` into a lesson slug. */
export function lessonOfPath(pathname: string): string {
	return pathname.replace(/^\/en(?=\/)/, '').replace(/^\/|\/$/g, '');
}

/** Writes a percentage into a `.hf-meter` progress bar. */
export function setMeter(meter: Element | null, percent: number): void {
	if (!(meter instanceof HTMLElement)) return;
	if (meter.getAttribute('role') === 'progressbar') meter.setAttribute('aria-valuenow', String(percent));
	meter.querySelector<HTMLElement>('.hf-meter__fill')?.style.setProperty('width', `${percent}%`);
}
