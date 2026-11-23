/**
 * Wires every `<Try>` panel on the page to the shared Python worker.
 * One run at a time. A run that lasts too long stops the worker, so the page stays usable.
 */

const WORKER_URL = '/python-worker.js';
const RUN_LIMIT_MS = 2000;
const LOAD_LIMIT_MS = 60000;
const SLOW_LOAD_MS = 300;

interface Labels {
	expected: string;
	actual: string;
	empty: string;
	run: string;
	running: string;
	loading: string;
	correct: string;
	wrong: string;
	error: string;
	timeout: string;
	load: string;
	placeholder: string;
}

type Result =
	| { ok: true; stdout: string }
	| { ok: false; kind: 'wrong' | 'error' | 'timeout' | 'load'; stdout: string; message: string };

interface DoneMessage {
	id: string;
	phase: 'ready' | 'done';
	ok?: boolean;
	/** Which program failed: the reader's code, or the hidden check that runs after it. */
	stage?: 'run' | 'check';
	stdout?: string;
	error?: string;
}

let worker: Worker | null = null;
let active: { id: string; finish: (result: Result) => void } | null = null;

function getWorker(): Worker {
	if (!worker) worker = new Worker(WORKER_URL, { type: 'module' });
	return worker;
}

function killWorker(): void {
	worker?.terminate();
	worker = null;
}

const TRACEBACK = 'Traceback (most recent call last):';

/**
 * Keeps the part of a Python traceback that is about the reader's file: its frames and the error itself.
 * The frames of the runtime and of the hidden check are dropped.
 */
function trimTraceback(error: string, file: string): string {
	const at = error.lastIndexOf(TRACEBACK);
	if (at === -1) return error.trim();

	const before = error
		.slice(0, at)
		.replace(/PythonError:\s*$/, '')
		.trim();
	const kept: string[] = [];
	let inFrames = true;
	let keep = false;

	for (const line of error.slice(at + TRACEBACK.length).split('\n')) {
		if (inFrames) {
			const frame = /^\s+File "([^"]*)", line \d+/.exec(line);
			if (frame) keep = frame[1] === file;
			else if (line.trim() && !/^\s/.test(line)) inFrames = false;
		}
		// The error itself starts at the first line that is not indented. Everything after it is kept.
		if (!inFrames) kept.push(line);
		else if (keep) kept.push(line.replace(/^ {2}/, ''));
	}

	return [before, kept.join('\n').trim()].filter(Boolean).join('\n\n');
}

function classify(stdout: string, error: string, stage: DoneMessage['stage'], file: string): Result {
	if (stage !== 'check') return { ok: false, kind: 'error', stdout, message: trimTraceback(error, file) };

	// The reader's code ran. An assertion carries the check's own message; any other error is shown as it is.
	const marker = 'AssertionError:';
	const at = error.lastIndexOf(marker);
	const message = at === -1 ? trimTraceback(error, file) : error.slice(at + marker.length).trim();
	return { ok: false, kind: 'wrong', stdout, message };
}

function execute(code: string, check: string, file: string, labels: Labels, onReady: () => void): Promise<Result> {
	return new Promise((resolve) => {
		const current = getWorker();
		const id = crypto.randomUUID();
		let runTimer = 0;
		let loadTimer = 0;
		let settled = false;

		const finish = (result: Result) => {
			if (settled) return;
			settled = true;
			window.clearTimeout(runTimer);
			window.clearTimeout(loadTimer);
			if (active?.id === id) active = null;
			resolve(result);
		};

		active = { id, finish };

		loadTimer = window.setTimeout(() => {
			killWorker();
			finish({ ok: false, kind: 'load', stdout: '', message: '' });
		}, LOAD_LIMIT_MS);

		current.onmessage = (event: MessageEvent<DoneMessage>) => {
			const data = event.data;
			if (!data || data.id !== id) return;

			if (data.phase === 'ready') {
				window.clearTimeout(loadTimer);
				onReady();
				runTimer = window.setTimeout(() => {
					killWorker();
					finish({ ok: false, kind: 'timeout', stdout: '', message: '' });
				}, RUN_LIMIT_MS);
				return;
			}

			if (data.ok) finish({ ok: true, stdout: data.stdout ?? '' });
			else finish(classify(data.stdout ?? '', data.error ?? '', data.stage, file));
		};

		current.onerror = () => {
			killWorker();
			finish({ ok: false, kind: 'load', stdout: '', message: '' });
		};

		current.postMessage({
			id,
			code,
			check,
			file,
			labels: { expected: labels.expected, actual: labels.actual, empty: labels.empty },
		});
	});
}

function labelsOf(root: HTMLElement): Labels {
	const data = root.dataset;
	return {
		expected: data.labelExpected ?? '',
		actual: data.labelActual ?? '',
		empty: data.labelEmpty ?? '',
		run: data.labelRun ?? '',
		running: data.labelRunning ?? '',
		loading: data.labelLoading ?? '',
		correct: data.labelCorrect ?? '',
		wrong: data.labelWrong ?? '',
		error: data.labelError ?? '',
		timeout: data.labelTimeout ?? '',
		load: data.labelLoad ?? '',
		placeholder: data.placeholder ?? '',
	};
}

function panels(): HTMLElement[] {
	return [...document.querySelectorAll<HTMLElement>('[data-hf-try]')];
}

function setBusy(activeRoot: HTMLElement | null, busy: boolean, label: string): void {
	for (const panel of panels()) {
		const run = panel.querySelector<HTMLButtonElement>('[data-run]');
		const reset = panel.querySelector<HTMLButtonElement>('[data-reset]');
		const runLabel = panel.querySelector<HTMLElement>('[data-run-label]');
		if (run) run.disabled = busy;
		if (reset) reset.disabled = busy;
		if (runLabel && panel === activeRoot) runLabel.textContent = label;
		if (runLabel && panel !== activeRoot && !busy) runLabel.textContent = labelsOf(panel).run;
	}
	if (activeRoot) activeRoot.dataset.busy = busy ? 'true' : 'false';
}

function showOutput(output: HTMLElement, text: string, muted: boolean, error = false): void {
	output.textContent = text;
	output.classList.toggle('is-muted', muted && !error);
	output.classList.toggle('is-error', error);
}

function showStatus(status: HTMLElement, text: string, kind: string): void {
	status.textContent = text;
	status.className = `hf-try__status${kind ? ` is-${kind}` : ''}`;
}

export function bindTry(): void {
	for (const root of panels()) {
		if (root.dataset.bound === 'true') continue;
		root.dataset.bound = 'true';

		const editor = root.querySelector<HTMLTextAreaElement>('.hf-try__editor');
		const checkBox = root.querySelector<HTMLTextAreaElement>('[data-try-check]');
		const output = root.querySelector<HTMLElement>('.hf-try__output');
		const status = root.querySelector<HTMLElement>('[data-status]');
		const verdict = root.querySelector<HTMLElement>('[data-verdict]');
		const run = root.querySelector<HTMLButtonElement>('[data-run]');
		const reset = root.querySelector<HTMLButtonElement>('[data-reset]');
		if (!editor || !checkBox || !output || !status || !verdict || !run || !reset) continue;

		const labels = labelsOf(root);
		const starter = editor.value;
		const check = checkBox.value;
		const file = root.dataset.file ?? 'main.py';

		const clear = () => {
			showOutput(output, labels.placeholder, true);
			showStatus(status, '', '');
			verdict.hidden = true;
			verdict.textContent = '';
			delete root.dataset.state;
		};

		editor.addEventListener('keydown', (event) => {
			if (event.key === 'Tab') {
				event.preventDefault();
				const start = editor.selectionStart;
				const value = editor.value;
				const lineStart = value.lastIndexOf('\n', start - 1) + 1;
				if (event.shiftKey) {
					const prefix = value.slice(lineStart, lineStart + 4);
					if (prefix !== '    ') return;
					editor.value = value.slice(0, lineStart) + value.slice(lineStart + 4);
					const next = Math.max(lineStart, start - 4);
					editor.selectionStart = editor.selectionEnd = next;
					return;
				}
				editor.value = `${value.slice(0, start)}    ${value.slice(editor.selectionEnd)}`;
				editor.selectionStart = editor.selectionEnd = start + 4;
				return;
			}

			if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
				event.preventDefault();
				run.click();
			}
		});

		reset.addEventListener('click', () => {
			if (root.dataset.busy === 'true') return;
			editor.value = starter;
			clear();
		});

		run.addEventListener('click', () => {
			if (root.dataset.busy === 'true') return;

			clear();
			showOutput(output, labels.running, true);
			showStatus(status, '', '');
			setBusy(root, true, labels.running);
			root.dataset.state = 'running';

			const slow = window.setTimeout(() => {
				const runLabel = root.querySelector<HTMLElement>('[data-run-label]');
				if (runLabel && root.dataset.state === 'running') runLabel.textContent = labels.loading;
				if (root.dataset.state === 'running') showOutput(output, labels.loading, true);
			}, SLOW_LOAD_MS);

			void execute(editor.value, check, file, labels, () => {
				window.clearTimeout(slow);
				if (root.dataset.state !== 'running') return;
				const runLabel = root.querySelector<HTMLElement>('[data-run-label]');
				if (runLabel) runLabel.textContent = labels.running;
				showOutput(output, labels.running, true);
			}).then((result) => {
				window.clearTimeout(slow);
				setBusy(null, false, labels.run);
				root.dataset.busy = 'false';

				if (result.ok) {
					root.dataset.state = 'correct';
					showOutput(output, result.stdout.trim() ? result.stdout.replace(/\s+$/, '') : labels.empty, !result.stdout.trim());
					showStatus(status, labels.correct, 'correct');
					return;
				}

				if (result.kind === 'timeout') {
					root.dataset.state = 'error';
					showOutput(output, labels.placeholder, true);
					showStatus(status, labels.timeout, 'error');
					return;
				}

				if (result.kind === 'load') {
					root.dataset.state = 'error';
					showOutput(output, labels.placeholder, true);
					showStatus(status, labels.load, 'error');
					return;
				}

				if (result.kind === 'wrong') {
					root.dataset.state = 'wrong';
					showOutput(output, result.stdout.trim() ? result.stdout.replace(/\s+$/, '') : labels.empty, !result.stdout.trim());
					showStatus(status, labels.wrong, 'wrong');
					verdict.hidden = false;
					verdict.textContent = result.message;
					return;
				}

				root.dataset.state = 'error';
				const parts = [result.stdout.trim(), result.message.trim()].filter(Boolean);
				showOutput(output, parts.join('\n\n') || labels.error, false, true);
				showStatus(status, labels.error, 'error');
			});
		});
	}
}
