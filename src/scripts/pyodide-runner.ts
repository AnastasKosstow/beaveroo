export interface RunResult {
	stdout: string;
	stderr: string;
	error: string | null;
}

export class PythonTimeoutError extends Error {
	constructor(public readonly timeoutMs: number) {
		super(`Python execution exceeded ${timeoutMs} ms`);
		this.name = 'PythonTimeoutError';
	}
}

export class PythonLoadError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'PythonLoadError';
	}
}

type WorkerMessage =
	| { type: 'ready' }
	| { type: 'init-error'; message: string }
	| ({ type: 'result'; id: number } & RunResult);

interface Pending {
	resolve: (result: RunResult) => void;
	reject: (error: Error) => void;
	timer: number;
}

const WORKER_URL = '/scripts/pyodide-worker.js';
export const DEFAULT_TIMEOUT_MS = 20_000;

let worker: Worker | null = null;
let readyPromise: Promise<void> | null = null;
let sequence = 0;
const pending = new Map<number, Pending>();

function rejectAll(error: Error): void {
	for (const entry of pending.values()) {
		window.clearTimeout(entry.timer);
		entry.reject(error);
	}
	pending.clear();
}

export function terminateRuntime(reason = 'Python runtime was stopped'): void {
	worker?.terminate();
	worker = null;
	readyPromise = null;
	rejectAll(new PythonLoadError(reason));
}

export function ensureRuntime(): Promise<void> {
	if (readyPromise) return readyPromise;

	readyPromise = new Promise<void>((resolve, reject) => {
		let instance: Worker;
		try {
			instance = new Worker(WORKER_URL, { type: 'module' });
		} catch (error) {
			reject(new PythonLoadError(error instanceof Error ? error.message : String(error)));
			return;
		}
		worker = instance;

		instance.onmessage = (event: MessageEvent<WorkerMessage>) => {
			const message = event.data;
			if (message.type === 'ready') {
				resolve();
			} else if (message.type === 'init-error') {
				const error = new PythonLoadError(message.message);
				reject(error);
				terminateRuntime(message.message);
			} else if (message.type === 'result') {
				const entry = pending.get(message.id);
				if (!entry) return;
				window.clearTimeout(entry.timer);
				pending.delete(message.id);
				entry.resolve({ stdout: message.stdout, stderr: message.stderr, error: message.error });
			}
		};

		instance.onerror = (event) => {
			const error = new PythonLoadError(event.message || 'Worker failed to load');
			reject(error);
			terminateRuntime(error.message);
		};

		instance.postMessage({ type: 'init' });
	});

	return readyPromise;
}

export async function runPython(code: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<RunResult> {
	await ensureRuntime();
	const instance = worker;
	if (!instance) throw new PythonLoadError('Python runtime is not available');

	const id = ++sequence;
	return new Promise<RunResult>((resolve, reject) => {
		const timer = window.setTimeout(() => {
			pending.delete(id);
			terminateRuntime('timeout');
			reject(new PythonTimeoutError(timeoutMs));
		}, timeoutMs);
		pending.set(id, { resolve, reject, timer });
		instance.postMessage({ type: 'run', id, code });
	});
}
