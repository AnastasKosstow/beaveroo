const PYODIDE_VERSION = '314.0.7';
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const USER_FILENAME = 'main.py';

let runtimePromise = null;
let queue = Promise.resolve();

function loadRuntime() {
	if (!runtimePromise) {
		runtimePromise = (async () => {
			const { loadPyodide } = await import(`${INDEX_URL}pyodide.mjs`);
			const pyodide = await loadPyodide({ indexURL: INDEX_URL });
			pyodide.setStdin({
				stdin: () => {
					throw new Error('input() is not available in the browser playground.');
				},
			});
			return pyodide;
		})();
		runtimePromise.catch(() => {
			runtimePromise = null;
		});
	}
	return runtimePromise;
}

function cleanTraceback(message) {
	const lines = String(message).replace(/\r/g, '').split('\n');
	const firstUserFrame = lines.findIndex((line) => line.includes(`File "${USER_FILENAME}"`));
	if (firstUserFrame === -1) return lines.join('\n').trim();
	const header = lines[0].startsWith('Traceback') ? [lines[0]] : [];
	return [...header, ...lines.slice(firstUserFrame)].join('\n').trim();
}

async function run(pyodide, code) {
	const stdout = [];
	const stderr = [];
	pyodide.setStdout({ batched: (text) => stdout.push(text) });
	pyodide.setStderr({ batched: (text) => stderr.push(text) });

	const namespace = pyodide.globals.get('dict')();
	namespace.set('__name__', '__main__');
	let error = null;
	try {
		await pyodide.runPythonAsync(code, { globals: namespace, filename: USER_FILENAME });
	} catch (err) {
		error = cleanTraceback(err && err.message ? err.message : err);
	} finally {
		namespace.destroy();
	}
	return { stdout: stdout.join('\n'), stderr: stderr.join('\n'), error };
}

self.onmessage = (event) => {
	const message = event.data || {};
	queue = queue.then(async () => {
		if (message.type === 'init') {
			try {
				await loadRuntime();
				self.postMessage({ type: 'ready' });
			} catch (err) {
				self.postMessage({ type: 'init-error', message: String((err && err.message) || err) });
			}
			return;
		}
		if (message.type === 'run') {
			try {
				const pyodide = await loadRuntime();
				const result = await run(pyodide, String(message.code ?? ''));
				self.postMessage({ type: 'result', id: message.id, ...result });
			} catch (err) {
				self.postMessage({ type: 'init-error', message: String((err && err.message) || err) });
			}
		}
	});
};
