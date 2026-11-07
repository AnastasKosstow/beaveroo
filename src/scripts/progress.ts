const PREFIX = 'co:progress:';
const EVENT = 'co:progress';

export interface ProgressDetail {
	courseId: string;
}

function key(courseId: string): string {
	return `${PREFIX}${courseId}`;
}

export function getCompleted(courseId: string): Set<string> {
	try {
		const raw = window.localStorage.getItem(key(courseId));
		const parsed: unknown = raw ? JSON.parse(raw) : [];
		return new Set(Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []);
	} catch {
		return new Set();
	}
}

export function isCompleted(courseId: string, moduleId: string): boolean {
	return getCompleted(courseId).has(moduleId);
}

export function setCompleted(courseId: string, moduleId: string, completed: boolean): void {
	const current = getCompleted(courseId);
	if (completed) current.add(moduleId);
	else current.delete(moduleId);
	try {
		window.localStorage.setItem(key(courseId), JSON.stringify([...current]));
	} catch {}
	window.dispatchEvent(new CustomEvent<ProgressDetail>(EVENT, { detail: { courseId } }));
}

export function onProgress(courseId: string, callback: (completed: Set<string>) => void): void {
	const run = () => callback(getCompleted(courseId));
	run();
	window.addEventListener(EVENT, (event) => {
		if ((event as CustomEvent<ProgressDetail>).detail?.courseId === courseId) run();
	});
	window.addEventListener('storage', (event) => {
		if (event.key === key(courseId)) run();
	});
}

export function readJson<T>(storageKey: string, fallback: T): T {
	try {
		const raw = window.localStorage.getItem(storageKey);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
}

export function writeJson(storageKey: string, value: unknown): void {
	try {
		window.localStorage.setItem(storageKey, JSON.stringify(value));
	} catch {}
}
