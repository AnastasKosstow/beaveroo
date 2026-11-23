/**
 * Runs lesson code in Pyodide, off the page thread, so a loop cannot freeze the tab.
 * The runtime is downloaded on the first run and then kept for every task on the page.
 * The reader's code stays in this worker. Nothing is sent to the site.
 */

const INDEX_URL = 'https://cdn.jsdelivr.net/pyodide/v314.0.8/full/';

/** The hidden check runs under its own file name, so a traceback can tell its lines from the reader's. */
const CHECK_FILE = '<check>';

let pyodidePromise = null;

function loadRuntime() {
	if (!pyodidePromise) {
		pyodidePromise = (async () => {
			const { loadPyodide } = await import(`${INDEX_URL}pyodide.mjs`);
			return await loadPyodide({ indexURL: INDEX_URL });
		})().catch((error) => {
			pyodidePromise = null;
			throw error;
		});
	}
	return pyodidePromise;
}

/** Helpers the lesson's hidden checks call: `_eq` for a returned value, `_out` for what was printed. */
function prelude(labels) {
	const expected = JSON.stringify(labels.expected);
	const actual = JSON.stringify(labels.actual);
	const empty = JSON.stringify(labels.empty);
	return [
		'def _eq(actual, expected, label):',
		'    if actual != expected:',
		'        raise AssertionError(label + "\\n" + ' + expected + ' + ": " + repr(expected) + "\\n" + ' + actual + ' + ": " + repr(actual))',
		'',
		'def _out(expected, label):',
		'    actual_lines = [line.rstrip() for line in _stdout.splitlines() if line.strip() != ""]',
		'    wanted = [line.rstrip() for line in expected.splitlines() if line.strip() != ""]',
		'    if actual_lines != wanted:',
		'        shown = _stdout.strip() if _stdout.strip() else ' + empty,
		'        raise AssertionError(label + "\\n" + ' + expected + ' + ":\\n" + expected.strip() + "\\n\\n" + ' + actual + ' + ":\\n" + shown)',
		'',
	].join('\n');
}

self.onmessage = async (event) => {
	const { id, code, check, file, labels } = event.data;
	const stdout = [];
	const stderr = [];
	let namespace = null;

	let py;
	try {
		py = await loadRuntime();
	} catch (error) {
		self.postMessage({ id, phase: 'done', ok: false, stdout: '', error: String(error) });
		return;
	}

	self.postMessage({ id, phase: 'ready' });

	// Which of the two programs failed: the reader's code, or the check that runs after it.
	let stage = 'run';

	try {
		const dict = py.globals.get('dict');
		namespace = dict();
		dict.destroy();

		const remember = (bucket) => (text) => {
			bucket.push(text.endsWith('\n') ? text : `${text}\n`);
		};
		py.setStdout({ batched: remember(stdout) });
		py.setStderr({ batched: remember(stderr) });

		await py.runPythonAsync(code, { globals: namespace, filename: file });

		namespace.set('_stdout', stdout.join(''));
		py.setStdout({ batched: () => {} });
		py.setStderr({ batched: () => {} });

		stage = 'check';
		await py.runPythonAsync(`${prelude(labels)}\n${check}\nNone`, { globals: namespace, filename: CHECK_FILE });

		self.postMessage({ id, phase: 'done', ok: true, stdout: stdout.join('') });
	} catch (error) {
		const extra = stderr.join('');
		const message = extra ? `${extra}\n${error}` : String(error);
		self.postMessage({ id, phase: 'done', ok: false, stage, stdout: stdout.join(''), error: message });
	} finally {
		namespace?.destroy();
	}
};
