//#region node_modules/.nitro/vite/services/ssr/assets/cache-BqkOvyUe.js
var mem = /* @__PURE__ */ new Map();
var inflight = /* @__PURE__ */ new Map();
async function cached(key, ttlMs, load) {
	const hit = mem.get(key);
	if (hit && Date.now() - hit.at < ttlMs) return hit.value;
	const pending = inflight.get(key);
	if (pending) return pending;
	const p = load().then((value) => {
		mem.set(key, {
			at: Date.now(),
			value
		});
		inflight.delete(key);
		return value;
	}).catch((err) => {
		inflight.delete(key);
		throw err;
	});
	inflight.set(key, p);
	return p;
}
//#endregion
export { cached as t };
