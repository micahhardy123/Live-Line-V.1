import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { f as createRouter, g as createRootRoute, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as teamLogo, D as __exportAll, c as formatPts, g as recordText, r as emptyPlayer, w as vsLabel, x as slotLabel } from "./format-F8w7-jdk.mjs";
import { g as ChevronLeft, h as ChevronRight, i as Swords, o as Share2, r as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-e8fG1DLy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-ClT6PvJi.css";
var APP_NAME = "LiveLine";
var Route$1 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Live Sleeper-style fantasy scores for your leagues — real points, matchups, and standings."
			},
			{
				name: "theme-color",
				content: "#070a12"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Avatar({ src, name, size = "md", ring }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("overflow-hidden rounded-full bg-surface-2", size === "sm" ? "size-8" : size === "lg" ? "size-14" : size === "xl" ? "size-16" : "size-11", ring === "hot" ? "shadow-[0_0_0_2px_var(--color-hot)]" : ring === "mint" ? "shadow-[0_0_0_2px_var(--color-primary)]" : ""),
		children: src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt: "",
			className: "size-full object-cover"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex size-full items-center justify-center font-display text-xs font-semibold",
			children: name[0]
		})
	});
}
function InjuryBadge({ tag }) {
	if (!tag) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex h-4 items-center rounded-xs px-1 font-display text-micro font-bold tracking-wide", tag === "OUT" || tag === "IR" || tag === "NA" || tag === "D" || tag === "SUS" ? "bg-live text-fg" : "bg-ques text-ques-fg"),
		children: tag
	});
}
function TeamMark({ abbr, className }) {
	if (!abbr) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: teamLogo(abbr),
		alt: "",
		className: cn("size-4 object-contain", className),
		onError: (e) => {
			e.currentTarget.style.display = "none";
		}
	});
}
function Football({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 18 12",
		className,
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
			cx: "9",
			cy: "6",
			rx: "8",
			ry: "5",
			fill: "currentColor"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M5 6h8M7.2 4.2 9 8.2M10.8 4.2 9 8.2",
			stroke: "#1b1b1b",
			strokeWidth: "0.85",
			strokeLinecap: "round"
		})]
	});
}
function DriveBar({ progress }) {
	const pct = Math.round(Math.min(.9, Math.max(.08, progress)) * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mt-1.5 h-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-border-strong",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full rounded-full bg-primary transition-[width] duration-500",
				style: { width: `${pct}%` }
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-fg",
			style: { left: `${pct}%` },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Football, { className: "size-3" })
		})]
	});
}
function LiveTickerBar({ ticker }) {
	if (!ticker) return null;
	const situation = [ticker.detail, ticker.downDistance].filter(Boolean).join(" · ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-3 mt-2 overflow-hidden rounded-xl bg-surface-2 px-3 py-2 shadow-[0_0_0_1px_rgb(255_255_255/0.06)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				ticker.playerHeadshot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: ticker.playerHeadshot,
					alt: "",
					className: "size-8 shrink-0 rounded-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 shrink-0 rounded-full bg-surface" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate text-2xs text-muted",
						children: situation
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate text-sm font-medium leading-tight",
						children: ticker.playText ?? "Live play"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 flex-col items-end gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamMark, { abbr: ticker.awayAbbr }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamMark, { abbr: ticker.homeAbbr }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-live/15 px-1.5 py-0.5 font-display text-micro font-bold tracking-wider text-live",
								children: "LIVE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-subtle" })
						]
					}), ticker.fantasyDelta != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-display text-2xs font-semibold tabular-nums text-primary",
						children: [ticker.fantasyDelta >= 0 ? "+" : "", formatPts(ticker.fantasyDelta, 1)]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-micro tabular-nums text-muted",
						children: [
							ticker.awayScore,
							"–",
							ticker.homeScore
						]
					})]
				})
			]
		})
	});
}
var tones = {
	QB: "bg-pos-qb text-primary-fg",
	RB: "bg-pos-rb text-fg",
	WR: "bg-pos-wr text-fg",
	TE: "bg-pos-te text-primary-fg",
	FLEX: "bg-pos-flex text-primary-fg",
	K: "bg-pos-k text-fg",
	DEF: "bg-pos-def text-primary-fg",
	BN: "bg-pos-bn text-fg"
};
function PosBadge({ slot, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex h-7 min-w-7 items-center justify-center rounded-md px-1.5", "font-display text-micro font-bold tracking-wide", tones[slot] ?? tones.BN, className),
		children: slotLabel(slot)
	});
}
function GameLine({ player, align }) {
	const g = player.game;
	const opp = vsLabel(g.opponent, g.homeAway);
	const live = g.state === "in";
	const label = live ? [
		g.clock && !/final/i.test(g.clock) ? g.clock : "LIVE",
		g.score?.replace("–", "-"),
		opp
	].filter(Boolean).join(" ") : [g.startLabel, opp].filter(Boolean).join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("mt-0.5 flex items-center gap-1 text-micro", live ? "text-muted" : "text-subtle", align === "right" && "flex-row-reverse"),
		children: [
			live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "live-dot size-1.5 shrink-0 rounded-full bg-live" }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "min-w-0 truncate",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamMark, { abbr: player.team })
		]
	});
}
function PlayerCell({ player, align, onOpen }) {
	const empty = player.id.startsWith("empty-");
	const live = !empty && player.game.state === "in" && !/final/i.test(player.game.clock ?? "");
	const done = !empty && player.game.state === "post";
	const pts = player.points == null ? "—" : formatPts(player.points);
	const clickable = Boolean(onOpen) && !empty;
	const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex items-start gap-2", align === "right" && "flex-row-reverse"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("min-w-0 flex-1", align === "right" && "text-right"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("flex items-center gap-1.5", align === "right" && "flex-row-reverse"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate font-display text-sm font-semibold leading-tight",
							children: player.shortName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InjuryBadge, { tag: player.injury })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-0.5 truncate text-micro text-muted",
						children: [
							player.pos,
							player.team ? ` · ${player.team}` : "",
							player.teamRank ? ` (${player.teamRank})` : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameLine, {
						player,
						align
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("shrink-0 pt-0.5", align === "right" ? "text-left" : "text-right"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("font-display text-sm font-semibold tabular-nums leading-none", live ? "text-primary" : done ? "text-fg" : "text-subtle"),
					children: pts
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-micro tabular-nums text-subtle",
					children: formatPts(player.projection)
				})]
			})]
		}),
		player.statLine && live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("mt-1 text-micro font-medium text-fg/80", align === "right" && "text-right"),
			children: player.statLine
		}) : null,
		live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DriveBar, { progress: player.game.progress }) : null
	] });
	if (empty) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-w-0 px-2.5 py-2" });
	const cls = cn("min-w-0 px-2.5 py-2 text-left transition-colors duration-200", align === "right" && "text-right", clickable && "hover:bg-surface-2/60");
	if (clickable) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: () => onOpen?.(player),
		className: cls,
		children: inner
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cls,
		children: inner
	});
}
function PlayerRow({ left, right, onOpen }) {
	const leftLive = left.game.state === "in" && !left.id.startsWith("empty-") && !/final/i.test(left.game.clock ?? "");
	const rightLive = right.game.state === "in" && !right.id.startsWith("empty-") && !/final/i.test(right.game.clock ?? "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden px-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid min-w-0 grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] items-stretch",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("min-w-0", leftLive && "rounded-l-xl bg-surface-live"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCell, {
						player: left,
						align: "left",
						onOpen
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("flex items-center justify-center", (leftLive || rightLive) && "bg-surface-live", leftLive && !rightLive && "rounded-r-xl", rightLive && !leftLive && "rounded-l-xl"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosBadge, { slot: left.slot === "BN" ? "BN" : left.slot })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("min-w-0", rightLive && "rounded-r-xl bg-surface-live"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCell, {
						player: right,
						align: "right",
						onOpen
					})
				})
			]
		})
	});
}
function ScoreHeader({ left, right, week, onWeek, canPrev, canNext }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-20 shrink-0 flex-col items-start gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							src: left.avatarUrl,
							name: left.teamName,
							ring: "hot"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-2xs font-bold tracking-wider text-hot",
							children: [Math.round(left.winPct * 100), "% WIN"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex min-w-0 flex-1 flex-col items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-display text-3xl font-semibold leading-none tabular-nums tracking-tight",
										children: formatPts(left.points)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 text-micro tabular-nums text-subtle",
										children: formatPts(left.projected)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-1 flex size-8 items-center justify-center rounded-full bg-surface-2 text-muted shadow-[0_0_0_1px_rgb(255_255_255/0.08)]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swords, { className: "size-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-left",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-display text-3xl font-semibold leading-none tabular-nums tracking-tight",
										children: formatPts(right.points)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 text-micro tabular-nums text-subtle",
										children: formatPts(right.projected)
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-20 shrink-0 flex-col items-end gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							src: right.avatarUrl,
							name: right.teamName,
							ring: "mint"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-2xs font-bold tracking-wider text-primary",
							children: [Math.round(right.winPct * 100), "% WIN"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate font-display text-sm font-semibold",
						children: left.teamName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "truncate text-micro text-muted",
						children: [
							"@",
							left.username,
							" · ",
							recordText(left.wins, left.losses, left.ties),
							" (#",
							left.rank,
							")"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate font-display text-sm font-semibold",
						children: right.teamName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "truncate text-micro text-muted",
						children: [
							recordText(right.wins, right.losses, right.ties),
							" (#",
							right.rank,
							") · @",
							right.username
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold tracking-tight",
					children: "Starters"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: !canPrev,
							onClick: () => onWeek(week - 1),
							className: "flex size-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:opacity-30",
							"aria-label": "Previous week",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-16 text-center font-display text-sm font-semibold text-primary",
							children: ["Week ", week]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: !canNext,
							onClick: () => onWeek(week + 1),
							className: "flex size-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:opacity-30",
							"aria-label": "Next week",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
						})
					]
				})]
			})
		]
	});
}
function YetToPlay({ data }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-3 mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-xl bg-surface px-3 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-micro uppercase tracking-wide text-subtle",
				children: [
					"yet to play (",
					data.left.yetToPlay,
					")"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 text-2xs leading-snug text-muted",
				children: data.left.yetToPlaySummary || "—"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1",
				children: data.left.starters.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: p.game.state === "in" ? "size-1.5 rounded-full bg-primary" : p.game.state === "post" ? "size-1.5 rounded-full bg-subtle" : "size-1.5 rounded-full bg-white/20" }, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-micro uppercase tracking-wide text-subtle",
					children: [
						"yet to play (",
						data.right.yetToPlay,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-0.5 text-2xs leading-snug text-muted",
					children: data.right.yetToPlaySummary || "—"
				})]
			})
		]
	});
}
function MatchupSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "phone-glow flex min-h-dvh items-center justify-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md animate-pulse rounded-3xl bg-surface p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-center font-display text-sm font-semibold tracking-[0.2em] text-primary",
					children: "LIVELINE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 rounded-2xl bg-surface-2" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-4 h-10 rounded-xl bg-surface-2" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 space-y-2",
					children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-14 rounded-xl bg-surface-2" }, i))
				})
			]
		})
	});
}
function ScoreboardCard({ m }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-2xl bg-surface px-3 py-3", m.isMine && "shadow-[0_0_0_1px_rgb(92_225_197/0.28)]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						src: m.leftAvatar,
						name: m.leftName,
						size: "sm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm font-semibold",
							children: m.leftName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-micro text-muted",
							children: [
								m.leftRecord,
								" (#",
								m.leftRank,
								")"
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-base font-semibold tabular-nums",
					children: formatPts(m.leftPoints, 1)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "my-1.5 flex justify-end",
				children: m.isLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 rounded-full bg-live/15 px-2 py-0.5 font-display text-micro font-bold tracking-wider text-live",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "live-dot size-1.5 rounded-full bg-live" }), "LIVE"]
				}) : m.isMine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-micro font-semibold text-primary",
					children: "Your matchup"
				}) : null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						src: m.rightAvatar,
						name: m.rightName,
						size: "sm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm font-semibold",
							children: m.rightName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-micro text-muted",
							children: [
								m.rightRecord,
								" (#",
								m.rightRank,
								")"
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-base font-semibold tabular-nums",
					children: formatPts(m.rightPoints, 1)
				})]
			})
		]
	});
}
function MatchupBoard({ data, onWeek, onPlayer, viewingOther, onOpenMatchup }) {
	const [shareMsg, setShareMsg] = (0, import_react.useState)(null);
	const [board, setBoard] = (0, import_react.useState)("mine");
	const starterRows = Math.max(data.left.starters.length, data.right.starters.length);
	const benchRows = Math.max(data.left.bench.length, data.right.bench.length);
	async function share() {
		const text = [
			`LiveLine · ${data.leagueName} · Week ${data.week}`,
			`${data.left.teamName} ${formatPts(data.left.points)}  vs  ${data.right.teamName} ${formatPts(data.right.points)}`,
			`Projected ${formatPts(data.left.projected)} – ${formatPts(data.right.projected)}`,
			`Win ${Math.round(data.left.winPct * 100)}% / ${Math.round(data.right.winPct * 100)}%`
		].join("\n");
		try {
			if (navigator.share) {
				await navigator.share({
					title: "LiveLine",
					text
				});
				setShareMsg("Shared");
			} else {
				await navigator.clipboard.writeText(text);
				setShareMsg("Copied recap");
			}
		} catch {
			setShareMsg(null);
		}
		window.setTimeout(() => setShareMsg(null), 1800);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-4 mt-3 grid grid-cols-2 rounded-full bg-surface p-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					onOpenMatchup(null);
					setBoard("all");
				},
				className: cn("rounded-full py-2 text-center text-2xs font-semibold", board === "all" ? "bg-surface-2 text-fg" : "text-muted"),
				children: "All Matchups"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					onOpenMatchup(null);
					setBoard("mine");
				},
				className: cn("rounded-full py-2 text-center text-2xs font-semibold", board === "mine" ? "bg-surface-2 text-fg" : "text-muted"),
				children: "My Matchup"
			})]
		}), board === "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 space-y-2 px-4",
			children: data.otherMatchups.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					onOpenMatchup(m.matchupId);
					setBoard("mine");
				},
				className: "block w-full text-left",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreboardCard, { m })
			}, m.matchupId))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			viewingOther ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-3 mt-3 flex items-center justify-between rounded-lg bg-surface px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-2xs text-muted",
					children: "Viewing this matchup"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onOpenMatchup(null),
					className: "text-2xs font-semibold text-primary",
					children: "Your matchup"
				})]
			}) : !data.isHeadToHead ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-3 mt-3 rounded-lg bg-surface px-3 py-2 text-center text-2xs text-muted",
				children: "Not facing each other this week — comparing both lineups"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreHeader, {
				left: data.left,
				right: data.right,
				week: data.week,
				onWeek,
				canPrev: data.week > 1,
				canNext: data.week < 18
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveTickerBar, { ticker: data.ticker }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YetToPlay, { data }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 space-y-1",
				children: Array.from({ length: starterRows }).map((_, i) => {
					const left = data.left.starters[i];
					const right = data.right.starters[i];
					if (!left || !right) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerRow, {
						left,
						right,
						onOpen: onPlayer
					}, `${left.id}-${right.id}-${i}`);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-5 px-4 text-sm font-semibold tracking-tight",
				children: "Bench"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 space-y-1",
				children: Array.from({ length: benchRows }).map((_, i) => {
					const left = data.left.bench[i];
					const right = data.right.bench[i];
					if (!left && !right) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerRow, {
						left: left ?? emptyPlayer("BN"),
						right: right ?? emptyPlayer("BN"),
						onOpen: onPlayer
					}, `bn-${left?.id ?? i}-${right?.id ?? i}`);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 px-4 text-center text-micro text-subtle",
				children: [
					"Updates every few seconds · Sleeper scoring · ",
					data.season,
					" ",
					data.league.scoringLabel
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => void share(),
					className: "mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-display text-sm font-bold tracking-[0.18em] text-primary-fg transition-transform duration-150 active:scale-[0.96]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), shareMsg ?? "SHARE"]
				})
			})
		] })]
	});
}
var $$splitComponentImporter = () => import("./routes-B_SE21Lr.mjs");
var Route = createFileRoute("/")({
	validateSearch: (search) => {
		const out = {};
		const w = Number(search.week);
		if (Number.isFinite(w) && w >= 1 && w <= 18) out.week = Math.trunc(w);
		if (typeof search.league === "string" && search.league.trim()) {
			const t = search.league.trim();
			if (/^(espn|yahoo):\d+$/.test(t) || /^\d{4,24}$/.test(t)) out.league = t;
		}
		return out;
	},
	pendingComponent: MatchupSkeleton,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = { IndexRoute: Route.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$1
}) };
var routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { PosBadge as a, TeamMark as c, MatchupSkeleton as i, cn as l, Route as n, Avatar as o, MatchupBoard as r, InjuryBadge as s, router_exports as t };
