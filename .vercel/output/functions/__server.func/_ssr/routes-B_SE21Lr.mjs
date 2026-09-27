import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { c as formatPts, g as recordText, r as emptyPlayer, w as vsLabel, y as sleeperAvatar } from "./format-F8w7-jdk.mjs";
import { a as parseLeagueRef, i as loadProfile, l as sleeperId, n as clearProfile, o as saveProfile, s as setActiveLeague, t as accountUsername, u as sleeperUsername } from "./leagues-Ad5L4M0D.mjs";
import { _ as ChevronDown, a as Shirt, c as Search, d as MessageSquare, f as LayoutGrid, h as ChevronRight, i as Swords, l as Radio, m as Crown, n as Trophy, o as Share2, p as History, s as Settings, t as X, u as Newspaper, v as Check } from "../_libs/lucide-react.mjs";
import { a as PosBadge, c as TeamMark, i as MatchupSkeleton, l as cn, n as Route, o as Avatar, r as MatchupBoard, s as InjuryBadge } from "./router-e8fG1DLy.mjs";
import { n as QueryClientProvider, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Drawer } from "../_libs/vaul.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B_SE21Lr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var lookupSleeperAccount = createServerFn({ method: "POST" }).validator((d) => {
	const platform = d?.platform === "espn" || d?.platform === "yahoo" ? d.platform : "sleeper";
	return {
		platform,
		username: platform === "sleeper" ? sleeperUsername(String(d?.username ?? "")) : accountUsername(String(d?.username ?? "")),
		leagueRef: platform === "sleeper" ? "" : parseLeagueRef(platform, String(d?.leagueRef ?? ""))
	};
}).handler(createSsrRpc("c906eaaa6a3f75c5437e3b7040d9e66188c967be9caab93cd38fceb932d852fa"));
var fetchLiveMatchup = createServerFn({ method: "POST" }).validator((d) => {
	const userId = sleeperId(String(d?.userId ?? ""));
	const leagueId = sleeperId(String(d?.leagueId ?? ""));
	const week = d?.week;
	const rawId = d?.matchupId;
	const matchupId = rawId != null && Number.isFinite(rawId) && rawId >= 1 ? Math.trunc(rawId) : void 0;
	if (week == null) return {
		userId,
		leagueId,
		matchupId
	};
	if (!Number.isFinite(week) || week < 1 || week > 18) throw new Error("Week must be between 1 and 18");
	return {
		week: Math.trunc(week),
		userId,
		leagueId,
		matchupId
	};
}).handler(createSsrRpc("f48a9cab7ae8790256f02c4af87b9e13218348c249a07cf53138cdd69ef8f11f"));
var fetchLeaguePicker = createServerFn({ method: "POST" }).validator((d) => {
	const userId = sleeperId(String(d?.userId ?? ""));
	const leagueIds = (d?.leagueIds ?? []).map((id) => sleeperId(String(id))).slice(0, 24);
	if (!leagueIds.length) throw new Error("Pick at least one league");
	return {
		userId,
		leagueIds
	};
}).handler(createSsrRpc("32ef36d4815b2a0f1ddff60e00ab20102c7a826eea86b38fc58fa15d1ca5ce34"));
var fetchPlayerDetail = createServerFn({ method: "POST" }).validator((d) => {
	const playerId = String(d?.playerId ?? "").trim();
	if (!playerId) throw new Error("Missing player");
	const week = d?.week;
	const leagueId = sleeperId(String(d?.league ?? d?.leagueId ?? ""));
	if (week == null) return {
		playerId,
		leagueId
	};
	if (!Number.isFinite(week) || week < 1 || week > 18) throw new Error("Week must be between 1 and 18");
	return {
		playerId,
		week: Math.trunc(week),
		leagueId
	};
}).handler(createSsrRpc("47b2057d0b9c38b73c391f0e3ac146cf2196f7f35a3bbf1e4e31dd9adeec5136"));
var fetchTrending = createServerFn({ method: "POST" }).handler(createSsrRpc("33d09bc6e9874f9c73ead42450eaeabf8b1892de0ded4f341051f4322dfe5e80"));
var fetchFreeAgents = createServerFn({ method: "POST" }).validator((d) => ({
	leagueId: sleeperId(String(d?.league ?? "")),
	q: String(d?.q ?? "").slice(0, 40),
	pos: String(d?.pos ?? "ALL").slice(0, 8)
})).handler(createSsrRpc("656db99a81f2893d88f9b90e75cec71bfd1ab11ff54ac76486e3799ef66a6107"));
var fetchEspnFeed = createServerFn({ method: "POST" }).handler(createSsrRpc("663cdd6d9f926498f4edae131b629f568a9ccf1ad37085d47756f70e68d6795a"));
var fetchEspnArticle = createServerFn({ method: "POST" }).validator((d) => {
	const id = String(d?.id ?? "").replace(/[^\d]/g, "").slice(0, 16);
	if (!id) throw new Error("Missing article");
	return { id };
}).handler(createSsrRpc("d76da8b96e9798519c59471595ea49b41a3822adf4110f885577e8038e48b922"));
function Tile({ icon: Icon, label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "flex flex-col items-center gap-2 rounded-xl bg-surface px-2 py-3 text-center transition-transform duration-150 active:scale-[0.96]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-10 items-center justify-center rounded-full bg-surface-2 text-primary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-micro font-semibold leading-tight text-muted",
			children: label
		})]
	});
}
function MatchupCard({ m }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-xl bg-surface px-3 py-3", m.isFeatured && "shadow-[0_0_0_1px_rgb(92_225_197/0.25)]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
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
					className: "font-display text-sm font-semibold tabular-nums",
					children: formatPts(m.leftPoints, 1)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "my-2 flex items-center justify-end",
				children: m.isLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 rounded-full bg-live/15 px-2 py-0.5 font-display text-micro font-bold tracking-wider text-live",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "live-dot size-1.5 rounded-full bg-live" }), "LIVE"]
				}) : null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
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
					className: "font-display text-sm font-semibold tabular-nums",
					children: formatPts(m.rightPoints, 1)
				})]
			})
		]
	});
}
function StandingLine({ row }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-3 border-b border-border px-3 py-2.5 last:border-b-0", (row.isLeft || row.isRight) && "bg-surface-live"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-5 text-center font-display text-2xs text-subtle",
				children: row.rank
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
				src: row.avatarUrl,
				name: row.teamName,
				size: "sm"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "truncate text-sm font-semibold",
					children: row.teamName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "truncate text-micro text-muted",
					children: row.displayName
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-sm tabular-nums",
					children: recordText(row.wins, row.losses, row.ties)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-micro tabular-nums text-muted",
					children: [formatPts(row.pointsFor, 1), " PF"]
				})]
			})
		]
	});
}
function LeaguePage({ data, onOpenMatchup }) {
	const [panel, setPanel] = (0, import_react.useState)("home");
	const info = data.league;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-3 px-4 pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					src: info.avatarUrl,
					name: info.name,
					size: "lg"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate font-display text-lg font-semibold",
						children: info.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-2xs text-muted",
						children: [
							info.season,
							" · ",
							info.teams,
							" teams · ",
							info.scoringLabel
						]
					})]
				})]
			}),
			panel !== "home" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 pt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPanel("home"),
					className: "text-2xs font-semibold text-primary",
					children: "← League home"
				})
			}) : null,
			panel === "home" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-4 gap-2 px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
							icon: MessageSquare,
							label: "League Chat",
							onClick: () => setPanel("chat")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
							icon: Trophy,
							label: "Trophy Room",
							onClick: () => setPanel("trophy")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
							icon: History,
							label: "League History",
							onClick: () => setPanel("history")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
							icon: Settings,
							label: "LM Tools",
							onClick: () => setPanel("tools")
						})
					]
				}),
				info.divisions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-6 px-4 text-sm font-semibold",
					children: "Divisions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 space-y-3 px-4",
					children: info.divisions.map((div) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-2xl bg-surface",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xs font-semibold tracking-wide text-primary",
								children: div.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-micro text-subtle",
								children: [div.rows.length, " teams"]
							})]
						}), div.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StandingLine, { row }, row.rosterId))]
					}, div.id))
				})] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-6 px-4 text-sm font-semibold",
					children: "Matchups"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 space-y-2 px-4",
					children: data.otherMatchups.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onOpenMatchup(m.matchupId),
						className: "block w-full text-left",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchupCard, { m })
					}, m.matchupId))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-6 px-4 text-sm font-semibold",
					children: "Recent Activity"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 divide-y divide-border overflow-hidden rounded-xl bg-surface mx-4",
					children: data.activity.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-3 py-4 text-center text-2xs text-muted",
						children: "No moves this week."
					}) : data.activity.slice(0, 8).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3 px-3 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							src: a.avatarUrl,
							name: a.teamName,
							size: "sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold",
								children: a.teamName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-2xs text-muted",
								children: [
									a.type === "waiver" ? "Waiver" : a.type === "free_agent" ? "Free agent" : a.type,
									a.adds.length ? ` · add ${a.adds.map((x) => x.name).join(", ")}` : "",
									a.drops.length ? ` · drop ${a.drops.map((x) => x.name).join(", ")}` : ""
								]
							})]
						})]
					}, a.id))
				})
			] }) : null,
			panel === "chat" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mt-3 overflow-hidden rounded-xl bg-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-3 py-2 text-2xs text-muted",
					children: "Recent roster moves"
				}), data.activity.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 border-t border-border px-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						src: a.avatarUrl,
						name: a.teamName,
						size: "sm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold",
						children: a.teamName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-2xs text-muted",
						children: [a.adds.length ? `Added ${a.adds.map((x) => x.name).join(", ")}. ` : "", a.drops.length ? `Dropped ${a.drops.map((x) => x.name).join(", ")}.` : ""]
					})] })]
				}, a.id))]
			}) : null,
			panel === "trophy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mt-3 space-y-3",
				children: [
					info.lastWinnerName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-2xl bg-surface px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-micro uppercase tracking-wide text-subtle",
							children: "Reigning champion"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-sm font-semibold",
							children: info.lastWinnerName
						})] })]
					}) : null,
					info.divisions.length > 0 ? info.divisions.map((div) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-2xl bg-surface",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-3 py-2 text-2xs font-semibold tracking-wide text-primary",
							children: div.name
						}), div.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StandingLine, { row }, row.rosterId))]
					}, div.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-2xl bg-surface",
						children: data.standings.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StandingLine, { row }, row.rosterId))
					}),
					info.divisions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "px-1 pt-1 text-sm font-semibold",
						children: "Overall"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-2xl bg-surface",
						children: data.standings.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StandingLine, { row }, `all-${row.rosterId}`))
					})] }) : null
				]
			}) : null,
			panel === "history" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mt-3 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface px-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm font-semibold",
						children: ["Season ", info.season]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-2xs text-muted",
						children: [
							info.teams,
							"-team ",
							info.keeper ? "keeper" : "redraft",
							" · ",
							info.scoringLabel,
							" · playoffs week",
							" ",
							info.playoffWeekStart,
							" (",
							info.playoffTeams,
							" teams)"
						]
					})]
				}), data.standings.slice(0, 3).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between rounded-xl bg-surface px-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-2xs text-subtle",
							children: ["#", row.rank]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold",
							children: row.teamName
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-sm tabular-nums",
						children: recordText(row.wins, row.losses, row.ties)
					})]
				}, row.rosterId))]
			}) : null,
			panel === "tools" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-4 mt-3 overflow-hidden rounded-xl bg-surface",
				children: [
					["Scoring", info.scoringLabel],
					["Pass TD", `${info.passTd} pts`],
					["Rush / Rec TD", `${info.rushTd} pts`],
					["Reception", `${info.rec}`],
					["Teams", String(info.teams)],
					["Playoff teams", String(info.playoffTeams)],
					["Playoff start", `Week ${info.playoffWeekStart}`],
					["Trade deadline", `Week ${info.tradeDeadline}`],
					["Waivers process", info.waiverDay],
					["Format", info.keeper ? "Keeper" : "Redraft"]
				].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-3 py-2.5 last:border-b-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold",
						children: v
					})]
				}, k))
			}) : null
		]
	});
}
function LeagueHeaderButton({ name, live, onOpen }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "flex items-center justify-center px-4 pt-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onOpen,
			className: "min-w-0 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "max-w-56 truncate font-display text-base font-semibold tracking-tight",
					children: name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 text-muted" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center gap-1.5 text-micro text-muted",
				children: live ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "live-dot size-1.5 rounded-full bg-live" }), "Live scoring"] }) : "Switch league"
			})]
		})
	});
}
function LeagueSheet({ open, currentSlug, leagues, loading, onClose, onSelect }) {
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center sm:items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close",
			className: "absolute inset-0 bg-black/60",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-sheet pb-[env(safe-area-inset-bottom)] shadow-sheet sm:rounded-3xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky top-0 z-10 flex items-center justify-between bg-sheet/95 px-4 py-3 backdrop-blur",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-base font-semibold",
					children: "My Leagues"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-micro text-muted",
					children: "Switch to live scores in another league"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "flex size-9 items-center justify-center rounded-full bg-surface-2 text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 px-4 pb-6 pt-2",
				children: [
					loading && leagues.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-2xl bg-surface" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-2xl bg-surface" })]
					}) : null,
					!loading && leagues.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-surface px-4 py-6 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "mx-auto size-5 text-live" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "No leagues on this account."
						})]
					}) : null,
					leagues.map((lg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeagueCard, {
						league: lg,
						active: lg.slug === currentSlug,
						onPick: () => {
							setActiveLeague(lg.id);
							onSelect(lg.slug);
						}
					}, lg.slug))
				]
			})]
		})]
	});
}
function LeagueCard({ league, active, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onPick,
		className: cn("w-full rounded-2xl bg-surface p-3 text-left transition-transform duration-150 active:scale-[0.98]", active && "shadow-[0_0_0_1px_rgb(92_225_197/0.45)]"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
				src: league.avatarUrl,
				name: league.shortName,
				size: "lg"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-0 truncate font-display text-sm font-semibold",
						children: league.name
					}), active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-micro font-bold tracking-wide text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }), "ACTIVE"]
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-0.5 text-micro text-muted",
					children: [
						league.season,
						" · ",
						league.teams,
						" teams · ",
						league.scoringLabel
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-xl bg-surface-2 px-3 py-2.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						src: league.myAvatar,
						name: league.myTeamName,
						size: "sm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-2xs font-semibold",
							children: league.myTeamName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-micro text-muted",
							children: league.myRecord
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-display text-sm font-semibold tabular-nums",
						children: [
							formatPts(league.myPoints, 1),
							"–",
							formatPts(league.oppPoints, 1)
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-micro text-subtle",
						children: ["Wk ", league.week]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-2xs font-semibold",
							children: league.oppName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-micro text-muted",
							children: "Opp"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						src: league.oppAvatar,
						name: league.oppName,
						size: "sm"
					})]
				})
			]
		})]
	});
}
function MorePage({ data, leagues, onOpenLeagues, onSelectLeague, onChangeAccount }) {
	async function share() {
		const text = [`LiveLine · ${data.leagueName} · Week ${data.week}`, `${data.left.teamName} ${formatPts(data.left.points)} vs ${data.right.teamName} ${formatPts(data.right.points)}`].join("\n");
		try {
			if (navigator.share) await navigator.share({
				title: "LiveLine",
				text
			});
			else await navigator.clipboard.writeText(text);
		} catch {}
	}
	const rows = [
		["Season", data.league.season],
		["Scoring", data.league.scoringLabel],
		["Pass TD", `${data.league.passTd} pts`],
		["Rush / Rec TD", `${data.league.rushTd} pts`],
		["Live games", String(data.liveGames)]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 pb-6 pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					src: data.left.avatarUrl,
					name: data.left.displayName,
					size: "lg"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-lg font-semibold",
						children: data.left.displayName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-2xs text-muted",
						children: [
							"@",
							data.left.username,
							" · ",
							leagues.length,
							" leagues"
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "My Leagues"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onOpenLeagues,
					className: "text-2xs font-semibold text-primary",
					children: "Switch"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 space-y-2",
				children: leagues.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onOpenLeagues,
					className: "flex w-full items-center justify-between rounded-2xl bg-surface px-3 py-3 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold",
						children: data.leagueName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-micro text-muted",
						children: "Tap to see your other league"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-subtle" })]
				}) : leagues.map((lg) => {
					const active = lg.slug === data.leagueSlug;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onSelectLeague(lg.slug),
						className: "flex w-full items-center gap-3 rounded-2xl bg-surface px-3 py-3 text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								src: lg.avatarUrl,
								name: lg.shortName,
								size: "md"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-sm font-semibold",
										children: lg.name
									}), active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-primary/15 px-2 py-0.5 text-micro font-bold tracking-wide text-primary",
										children: "ON"
									}) : null]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 truncate text-micro text-muted",
									children: [
										lg.myTeamName,
										" · ",
										formatPts(lg.myPoints, 1),
										" vs ",
										lg.oppName,
										" ",
										formatPts(lg.oppPoints, 1)
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 shrink-0 text-subtle" })
						]
					}, lg.slug);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 text-sm font-semibold",
				children: "This league"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 overflow-hidden rounded-xl bg-surface",
				children: rows.map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-3 py-2.5 last:border-b-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "max-w-48 truncate text-right text-sm font-semibold",
						children: v
					})]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-start gap-3 rounded-xl bg-surface px-3 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "mt-0.5 size-4 text-live" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-2xs leading-relaxed text-muted",
					children: "LiveLine pulls real Sleeper points for every NFL window — Thursday, Sunday, and Monday. Switch leagues anytime from the header or here."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => void share(),
				className: "mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-display text-sm font-bold tracking-[0.18em] text-primary-fg transition-transform duration-150 active:scale-[0.96]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), "SHARE MATCHUP"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onChangeAccount,
				className: "mt-3 flex h-12 w-full items-center justify-center rounded-full bg-surface text-sm font-semibold text-muted",
				children: "Change account"
			})
		]
	});
}
function FeedPage() {
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const query = useQuery({
		queryKey: ["espn-feed"],
		queryFn: () => fetchEspnFeed(),
		staleTime: 6e4,
		refetchInterval: 9e4
	});
	const stories = query.data ?? [];
	const teaser = stories.find((s) => s.id === openId) ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "px-4 pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-lg font-semibold",
					children: "Feed"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-2xs text-muted",
					children: "Live NFL headlines from ESPN"
				})]
			}),
			query.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3 px-4",
				children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-2xl bg-surface" }, i))
			}) : null,
			query.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mt-8 rounded-2xl bg-surface px-4 py-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "mx-auto size-6 text-live" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Couldn’t load ESPN headlines."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => query.refetch(),
						className: "mt-3 rounded-full bg-primary px-4 py-2 text-2xs font-semibold text-primary-fg",
						children: "Retry"
					})
				]
			}) : null,
			!query.isLoading && !query.isError && stories.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mt-8 rounded-2xl bg-surface px-4 py-8 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, { className: "mx-auto size-6 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "No stories yet. Check back in a bit."
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3 px-4",
				children: stories.map((story) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryCard, {
					story,
					onOpen: () => setOpenId(story.id)
				}, story.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleSheet, {
				story: teaser,
				onClose: () => setOpenId(null)
			})
		]
	});
}
function StoryCard({ story, onOpen }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "overflow-hidden rounded-2xl bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onOpen,
			className: "w-full text-left",
			children: [story.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: story.image,
				alt: "",
				className: "h-36 w-full object-cover"
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-3 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-micro text-subtle",
						children: [story.teams[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-primary",
							children: story.teams.join(" · ")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "NFL" }), story.publishedLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· ", story.publishedLabel] }) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-sm font-semibold leading-snug",
						children: story.headline
					}),
					story.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 line-clamp-2 text-2xs leading-relaxed text-muted",
						children: story.description
					}) : null
				]
			})]
		})
	});
}
function ArticleSheet({ story, onClose }) {
	const open = Boolean(story);
	const article = useQuery({
		queryKey: ["espn-article", story?.id],
		queryFn: () => fetchEspnArticle({ data: { id: story.id } }),
		enabled: open && Boolean(story?.id),
		staleTime: 3e5
	});
	const body = article.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Root, {
		open,
		onOpenChange: (next) => {
			if (!next) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer.Portal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Overlay, { className: "fixed inset-0 z-40 bg-bg/80" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer.Content, {
			className: "fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[94dvh] max-w-md flex-col rounded-t-2xl bg-sheet shadow-sheet outline-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-4 pt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Title, {
					className: "font-display text-sm font-semibold tracking-wide",
					children: "STORY"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "flex size-10 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-fg",
					"aria-label": "Close story",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto pb-8",
				children: [
					body?.image || story?.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: body?.image || story?.image || "",
						alt: "",
						className: "h-44 w-full object-cover"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 pt-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-micro text-subtle",
								children: [(body?.teams ?? story?.teams)?.[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-primary",
									children: (body?.teams ?? story?.teams ?? []).join(" · ")
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "NFL" }), body?.publishedLabel || story?.publishedLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· ", body?.publishedLabel || story?.publishedLabel] }) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 font-display text-lg font-semibold leading-snug",
								children: body?.headline || story?.headline
							}),
							body?.byline || story?.byline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-micro text-muted",
								children: body?.byline || story?.byline
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 px-4 pt-4",
						children: [
							article.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xs text-muted",
								children: "Loading full story…"
							}) : null,
							article.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xs leading-relaxed text-muted",
								children: story?.description || "Couldn’t load the full story."
							}) : null,
							(body?.paragraphs ?? []).map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed text-muted",
								children: p
							}, i)),
							!article.isLoading && body && body.paragraphs.length === 0 && body.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed text-muted",
								children: body.description
							}) : null
						]
					})
				]
			})]
		})] })
	});
}
function asSlot(pos) {
	if (pos === "QB" || pos === "RB" || pos === "WR" || pos === "TE" || pos === "K" || pos === "DEF") return pos;
	return "FLEX";
}
function StatsGrid({ cells }) {
	if (!cells.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-1 text-2xs text-muted",
		children: "No stats yet."
	});
	const cols = cells.length % 3 === 0 || cells.length > 5 ? "grid-cols-3" : cells.length === 5 ? "grid-cols-5" : "grid-cols-4";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("grid gap-y-3", cols),
		children: cells.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-micro uppercase tracking-wide text-subtle",
				children: c.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 font-display text-sm font-semibold tabular-nums",
				children: c.value
			})]
		}, c.key))
	});
}
function TripleTable({ rows }) {
	if (!rows.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-xl bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-4 border-b border-border px-3 py-2 text-micro uppercase tracking-wide text-subtle",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-center",
					children: "Season"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-center",
					children: "Last Season"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-center",
					children: "Career"
				})
			]
		}), rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-4 border-b border-border px-3 py-2 last:border-b-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-2xs font-semibold text-muted",
					children: r.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-center font-display text-sm tabular-nums",
					children: r.season
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-center font-display text-sm tabular-nums",
					children: r.last
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-center font-display text-sm tabular-nums",
					children: r.career
				})
			]
		}, r.label))]
	});
}
function mergeTriple(season, last, career) {
	const labels = /* @__PURE__ */ new Map();
	for (const c of [
		...season,
		...last,
		...career
	]) labels.set(c.key, c.label);
	const order = [...season.map((c) => c.key)];
	for (const c of last) if (!order.includes(c.key)) order.push(c.key);
	for (const c of career) if (!order.includes(c.key)) order.push(c.key);
	const val = (arr, key) => arr.find((c) => c.key === key)?.value ?? "—";
	return order.map((key) => ({
		label: labels.get(key) ?? key,
		season: val(season, key),
		last: val(last, key),
		career: val(career, key)
	}));
}
function ShareCard({ detail, player, onClose }) {
	const rows = mergeTriple(detail.seasonStats, detail.lastSeasonStats, detail.careerStats);
	async function share() {
		const text = [
			`${player.name} · ${player.pos} · ${player.team ?? ""}`,
			`${detail.season} Regular Season`,
			...rows.map((r) => `${r.label}: ${r.season} / ${r.last} / ${r.career}`)
		].join("\n");
		try {
			if (navigator.share) await navigator.share({
				title: player.name,
				text
			});
			else await navigator.clipboard.writeText(text);
		} catch {}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-20 flex flex-col bg-bg/95 backdrop-blur-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-base font-semibold",
				children: "Share Screenshot"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onClose,
				className: "flex size-10 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-fg",
				"aria-label": "Close share",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-y-auto px-5 pb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-2xl bg-sheet shadow-phone",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between px-4 pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-micro uppercase tracking-wide text-subtle",
								children: [detail.season, " Regular Season"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 font-display text-xl font-semibold",
								children: player.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-0.5 text-2xs text-muted",
								children: [player.pos, player.team ? ` · ${player.team}` : ""]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: player.headshot,
							alt: "",
							className: "size-16 rounded-lg object-cover object-top"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 px-2 pb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TripleTable, { rows: rows.slice(0, 8) })
					}),
					detail.gameLog[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-micro font-semibold uppercase tracking-wide text-subtle",
							children: "Game Log"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center justify-between text-2xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [
									detail.gameLog[0].dateLabel,
									" ",
									detail.gameLog[0].homeAway,
									" ",
									detail.gameLog[0].opponent
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display tabular-nums text-primary",
								children: formatPts(detail.gameLog[0].fantasyPts)
							})]
						})]
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void share(),
				className: "mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-display text-sm font-bold tracking-[0.18em] text-primary-fg transition-transform duration-150 active:scale-[0.96]",
				children: "SHARE"
			})]
		})]
	});
}
function PlayerSheet({ player, week, league, onClose, onBackToMatchup }) {
	const [more, setMore] = (0, import_react.useState)(false);
	const [sharing, setSharing] = (0, import_react.useState)(false);
	const open = Boolean(player);
	const query = useQuery({
		queryKey: [
			"player",
			player?.id,
			week,
			league
		],
		queryFn: () => fetchPlayerDetail({ data: {
			playerId: player.id,
			week,
			league
		} }),
		enabled: open && Boolean(player && !player.id.startsWith("empty-")),
		refetchInterval: player?.game.state === "in" ? 8e3 : false,
		staleTime: 4e3
	});
	const detail = query.data;
	const triple = (0, import_react.useMemo)(() => detail ? mergeTriple(detail.seasonStats, detail.lastSeasonStats, detail.careerStats) : [], [detail]);
	const opp = player ? vsLabel(player.game.opponent, player.game.homeAway) || vsLabel(detail?.opponent ?? null, detail?.homeAway ?? null) : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Root, {
		open,
		onOpenChange: (next) => {
			if (!next) {
				setMore(false);
				setSharing(false);
				onClose();
			}
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer.Portal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Overlay, { className: "fixed inset-0 z-40 bg-bg/80" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Content, {
			className: "fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[94dvh] max-w-md flex-col rounded-t-2xl bg-sheet shadow-sheet outline-none",
			children: player ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex min-h-0 flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-4 pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Title, {
							className: "font-display text-sm font-semibold tracking-wide",
							children: "MATCHUP"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xs font-medium text-muted",
							children: opp || "This week"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "flex size-10 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-fg",
							"aria-label": "Close player",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-h-0 flex-1 overflow-y-auto px-4 pb-28",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-start gap-3 rounded-xl bg-surface p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: player.headshot,
										alt: "",
										className: "size-16 rounded-lg object-cover object-top",
										onError: (e) => {
											e.currentTarget.style.visibility = "hidden";
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "truncate font-display text-lg font-semibold leading-tight",
													children: player.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InjuryBadge, { tag: player.injury })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-0.5 flex items-center gap-1.5 text-2xs text-muted",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosBadge, {
													slot: asSlot(player.pos),
													className: "h-5 min-w-5 px-1 text-micro"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													player.pos,
													player.team ? ` · ${player.team}` : "",
													player.teamRank ? ` (${player.teamRank})` : ""
												] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1 flex items-center gap-1.5 text-2xs text-subtle",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamMark, { abbr: player.team }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [opp, player.game.startLabel ? ` · ${player.game.startLabel}` : ""] })]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-display text-xl font-semibold tabular-nums text-primary",
											children: formatPts(player.points)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-micro tabular-nums text-subtle",
											children: formatPts(player.projection)
										})]
									})
								]
							}),
							detail && detail.scoringPlays.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "mt-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mb-2 text-sm font-semibold",
									children: "Fantasy Scoring Plays"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2",
									children: detail.scoringPlays.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-3 rounded-lg bg-surface px-3 py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-micro text-muted",
												children: [
													p.period,
													" ",
													p.clock,
													p.downDistance ? `  ${p.downDistance}` : ""
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm leading-snug",
												children: p.text
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "shrink-0 font-display text-sm font-semibold tabular-nums text-primary",
											children: formatPts(p.points)
										})]
									}, p.id))
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "mt-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mb-3 text-sm font-semibold",
									children: "Game Stats"
								}), query.isLoading && !detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 animate-pulse rounded-xl bg-surface" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsGrid, { cells: detail?.gameStats ?? [] })]
							}),
							more && detail?.extraStats.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mb-3 text-sm font-semibold",
									children: "More Stats"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsGrid, { cells: detail.extraStats })]
							}) : null,
							detail && detail.gameLog.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "mt-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mb-2 text-sm font-semibold",
									children: "Game Log"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-hidden rounded-xl bg-surface",
									children: (more ? detail.gameLog : detail.gameLog.slice(0, 4)).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-b border-border px-3 py-2.5 last:border-b-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-2xs text-muted",
												children: [
													g.dateLabel,
													" ",
													g.homeAway,
													" ",
													g.opponent
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display text-sm font-semibold tabular-nums text-primary",
												children: formatPts(g.fantasyPts)
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-micro text-subtle",
											children: g.line.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												c.label,
												" ",
												c.value
											] }, c.key))
										})]
									}, `${g.week}-${g.dateLabel}`))
								})]
							}) : null,
							triple.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
								className: "mt-5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TripleTable, { rows: more ? triple : triple.slice(0, 8) })
							}) : null,
							detail && detail.news.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "mt-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mb-2 text-sm font-semibold",
									children: "News"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2",
									children: (more ? detail.news : detail.news.slice(0, 3)).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
										className: "flex gap-3 rounded-xl bg-surface p-3",
										children: [n.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: n.image,
											alt: "",
											className: "h-14 w-20 shrink-0 rounded-md object-cover"
										}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-medium leading-snug",
												children: n.headline
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 text-micro text-subtle",
												children: n.publishedLabel
											})]
										})]
									}, n.id))
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMore((v) => !v),
								className: "mt-5 flex h-11 w-full items-center justify-center rounded-full bg-primary font-display text-sm font-bold tracking-wide text-primary-fg transition-transform duration-150 active:scale-[0.96]",
								children: more ? "Show Less" : "View More"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-0 bottom-0 grid grid-cols-2 gap-3 bg-sheet/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onBackToMatchup,
							className: "h-11 rounded-full bg-surface-2 text-sm font-semibold transition-transform duration-150 active:scale-[0.96]",
							children: "Go to Matchup"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSharing(true),
							className: "flex h-11 items-center justify-center gap-2 rounded-full bg-surface-2 text-sm font-semibold transition-transform duration-150 active:scale-[0.96]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), "Share Stats"]
						})]
					}),
					sharing && detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareCard, {
						detail,
						player,
						onClose: () => setSharing(false)
					}) : null
				]
			}) : null
		})] })
	});
}
var FILTERS = [
	"ALL",
	"QB",
	"RB",
	"WR",
	"TE",
	"K",
	"DEF"
];
function toView(p) {
	return {
		...emptyPlayer("BN"),
		id: p.id,
		name: p.name,
		shortName: p.shortName,
		pos: p.pos,
		team: p.team,
		headshot: p.headshot,
		espnId: p.espnId,
		injury: "injury" in p ? p.injury : null,
		projection: "projection" in p ? p.projection : 0
	};
}
function Row({ name, meta, right, injury, team, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-2/60",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamMark, {
				abbr: team,
				className: "size-6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-sm font-semibold",
						children: name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InjuryBadge, { tag: injury })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "truncate text-micro text-muted",
					children: meta
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-sm tabular-nums text-muted",
				children: right
			})
		]
	});
}
function PlayersPage({ data, onPlayer }) {
	const [q, setQ] = (0, import_react.useState)("");
	const [debounced, setDebounced] = (0, import_react.useState)("");
	const [pos, setPos] = (0, import_react.useState)("ALL");
	const [scope, setScope] = (0, import_react.useState)("available");
	(0, import_react.useEffect)(() => {
		const t = window.setTimeout(() => setDebounced(q.trim()), 220);
		return () => window.clearTimeout(t);
	}, [q]);
	const trending = useQuery({
		queryKey: ["trending"],
		queryFn: () => fetchTrending(),
		staleTime: 6e4,
		enabled: scope === "available" && !debounced
	});
	const freeAgents = useQuery({
		queryKey: [
			"fa",
			data.leagueSlug,
			pos,
			debounced
		],
		queryFn: () => fetchFreeAgents({ data: {
			league: data.leagueSlug,
			q: debounced,
			pos
		} }),
		enabled: scope === "available",
		staleTime: 2e4
	});
	const rostered = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		return data.leaguePlayers.filter((p) => {
			if (pos !== "ALL" && p.pos !== pos) return false;
			if (!needle) return true;
			return `${p.name} ${p.team ?? ""} ${p.ownerName}`.toLowerCase().includes(needle);
		});
	}, [
		data.leaguePlayers,
		pos,
		q
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "px-4 pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-lg font-semibold",
					children: "Players"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-2 rounded-full bg-surface p-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setScope("available"),
						className: cn("rounded-full py-2 text-center text-2xs font-semibold", scope === "available" ? "bg-surface-2 text-fg" : "text-muted"),
						children: "Available"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setScope("rostered"),
						className: cn("rounded-full py-2 text-center text-2xs font-semibold", scope === "rostered" ? "bg-surface-2 text-fg" : "text-muted"),
						children: "On rosters"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 flex h-11 items-center gap-2 rounded-full bg-surface px-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: scope === "available" ? "Search free agents" : "Search league players",
						className: "h-full w-full bg-transparent text-sm outline-none placeholder:text-subtle"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex gap-1 overflow-x-auto",
					children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setPos(f),
						className: cn("shrink-0 rounded-full px-3 py-1 text-2xs font-semibold", pos === f ? "bg-primary text-primary-fg" : "bg-surface text-muted"),
						children: f
					}, f))
				})
			]
		}), scope === "available" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [!debounced && trending.data && trending.data.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "px-4 text-sm font-semibold",
				children: "Trending waivers"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1",
				children: trending.data.slice(0, 8).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					name: p.shortName,
					meta: `${p.pos}${p.team ? ` · ${p.team}` : ""} · ${p.kind === "add" ? "Adds" : "Drops"}`,
					right: p.count > 1e3 ? `${Math.round(p.count / 1e3)}k` : String(p.count),
					injury: null,
					team: p.team,
					onClick: () => onPlayer(toView(p))
				}, `${p.kind}-${p.id}`))
			})]
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "px-4 text-sm font-semibold",
					children: debounced ? "Search results" : "Free agents"
				}),
				freeAgents.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-6 text-center text-2xs text-muted",
					children: "Loading available players…"
				}) : null,
				freeAgents.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-6 text-center text-2xs text-muted",
					children: "Couldn’t load free agents."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1",
					children: (freeAgents.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						name: p.shortName,
						meta: `${p.pos}${p.team ? ` · ${p.team}` : ""} · FA`,
						right: formatPts(p.projection),
						injury: p.injury,
						team: p.team,
						onClick: () => onPlayer(toView(p))
					}, p.id))
				}),
				freeAgents.data && freeAgents.data.length === 0 && !freeAgents.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-6 text-center text-2xs text-muted",
					children: "No available players match."
				}) : null
			]
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "px-4 text-sm font-semibold",
					children: "In this league"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1",
					children: rostered.slice(0, 80).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						name: p.shortName,
						meta: `${p.pos}${p.team ? ` · ${p.team}` : ""} · ${p.ownerName}`,
						right: formatPts(p.projection),
						injury: p.injury,
						team: p.team,
						onClick: () => onPlayer(toView(p))
					}, p.id))
				}),
				rostered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-6 text-center text-2xs text-muted",
					children: "No rostered players match."
				}) : null
			]
		})]
	});
}
function StatChip({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0 flex-1 rounded-lg bg-surface px-2 py-2 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-micro uppercase tracking-wide text-subtle",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-0.5 truncate font-display text-sm font-semibold tabular-nums",
			children: value
		})]
	});
}
function LineRow({ player, onOpen }) {
	if (player.id.startsWith("empty-")) return null;
	const pts = player.game.state === "pre" || player.game.state === "bye" ? player.projection : player.points ?? player.projection;
	const live = player.game.state === "in";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => onOpen(player),
		className: "flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-2/60",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate font-display text-sm font-semibold",
						children: player.shortName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InjuryBadge, { tag: player.injury })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-0.5 text-micro text-muted",
					children: [
						player.pos,
						player.team ? ` · ${player.team}` : "",
						player.teamRank ? ` (${player.teamRank})` : ""
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamMark, {
				abbr: player.team,
				className: "size-5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-28 text-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("text-2xs", live ? "text-primary" : "text-muted"),
					children: live ? player.game.clock ?? "LIVE" : player.game.startLabel
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "truncate text-micro text-subtle",
					children: vsLabel(player.game.opponent, player.game.homeAway)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("w-12 text-right font-display text-sm tabular-nums", live && "text-primary"),
				children: formatPts(pts)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-subtle" })
		]
	});
}
function TeamPage({ data, side, onSide, onPlayer }) {
	const team = side === "left" ? data.left : data.right;
	const [tab, setTab] = (0, import_react.useState)("starters");
	const list = tab === "starters" ? team.starters : team.bench;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-3 px-4 pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					src: team.avatarUrl,
					name: team.teamName,
					size: "lg",
					ring: side === "left" ? "hot" : "mint"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate font-display text-lg font-semibold",
						children: team.teamName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-2xs text-muted",
						children: [
							"@",
							team.username,
							" · ",
							recordText(team.wins, team.losses, team.ties),
							" (#",
							team.rank,
							")"
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex gap-1 px-4",
				children: ["left", "right"].map((s) => {
					const t = s === "left" ? data.left : data.right;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onSide(s),
						className: cn("flex-1 rounded-full px-3 py-1.5 text-2xs font-semibold transition-colors", side === s ? "bg-primary text-primary-fg" : "bg-surface text-muted"),
						children: t.teamName
					}, s);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-2 px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
						label: "PF",
						value: formatPts(team.points, 1)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
						label: "PA",
						value: formatPts(team.pointsAgainst, 1)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
						label: "Max PF",
						value: formatPts(team.maxPf, 1)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
						label: "Rank",
						value: `#${team.rank}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
						label: "Waiver",
						value: `#${team.waiverPosition}`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-4 mt-4 flex rounded-full bg-surface p-1",
				children: ["starters", "bench"].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(t),
					className: cn("flex-1 rounded-full py-1.5 text-sm font-semibold capitalize", tab === t ? "bg-surface-2 text-fg" : "text-muted"),
					children: t
				}, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 divide-y divide-border",
				children: list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineRow, {
					player: p,
					onOpen: onPlayer
				}, p.id))
			})
		]
	});
}
var ITEMS = [
	{
		id: "matchup",
		label: "Board",
		icon: Swords
	},
	{
		id: "team",
		label: "Team",
		icon: Shirt
	},
	{
		id: "players",
		label: "Players",
		icon: Search
	},
	{
		id: "league",
		label: "League",
		icon: Trophy
	},
	{
		id: "feed",
		label: "Feed",
		icon: Newspaper
	},
	{
		id: "more",
		label: "More",
		icon: LayoutGrid
	}
];
function BottomNav({ tab, onTab, live }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-nav/95 backdrop-blur-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto grid max-w-md grid-cols-6 pb-[env(safe-area-inset-bottom)]",
			children: ITEMS.map((item) => {
				const active = tab === item.id;
				const Icon = item.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onTab(item.id),
					className: cn("relative flex flex-col items-center gap-0.5 py-2 text-micro font-semibold", active ? "text-primary" : "text-subtle"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }),
						item.id === "matchup" && live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-4 top-1.5 size-1.5 rounded-full bg-live" }) : null
					]
				}, item.id);
			})
		})
	});
}
function ShellInner({ profile, requestedWeek, onWeek, onLeague, onChangeAccount }) {
	const leagueId = profile.activeLeagueId;
	const leagueIds = profile.leagues.map((l) => l.id);
	const [tab, setTab] = (0, import_react.useState)("matchup");
	const [teamSide, setTeamSide] = (0, import_react.useState)("left");
	const [player, setPlayer] = (0, import_react.useState)(null);
	const [pickerOpen, setPickerOpen] = (0, import_react.useState)(false);
	const [viewMatchupId, setViewMatchupId] = (0, import_react.useState)(void 0);
	const query = useQuery({
		queryKey: [
			"matchup",
			profile.userId,
			leagueId,
			requestedWeek ?? "now",
			viewMatchupId ?? "mine"
		],
		queryFn: () => fetchLiveMatchup({ data: {
			week: requestedWeek,
			leagueId,
			userId: profile.userId,
			matchupId: viewMatchupId
		} }),
		refetchInterval: 8e3,
		refetchOnWindowFocus: true,
		staleTime: 4e3,
		placeholderData: (prev) => prev
	});
	const leagues = useQuery({
		queryKey: [
			"league-picker",
			profile.userId,
			leagueIds.join(",")
		],
		queryFn: () => fetchLeaguePicker({ data: {
			userId: profile.userId,
			leagueIds
		} }),
		staleTime: 2e4,
		refetchInterval: 2e4
	});
	const data = query.data;
	(0, import_react.useEffect)(() => {
		if (!data) return;
		document.title = `${formatPts(data.left.points)}–${formatPts(data.right.points)} · ${data.leagueName}`;
	}, [data]);
	(0, import_react.useEffect)(() => {
		window.scrollTo(0, 0);
	}, [tab, leagueId]);
	(0, import_react.useEffect)(() => {
		setViewMatchupId(void 0);
	}, [leagueId, requestedWeek]);
	function selectLeague(slug) {
		setPickerOpen(false);
		setPlayer(null);
		setTeamSide("left");
		setViewMatchupId(void 0);
		setTab("matchup");
		setActiveLeague(slug);
		onLeague(slug);
	}
	function openMatchup(id) {
		setViewMatchupId(id ?? void 0);
		setTab("matchup");
	}
	if (query.isLoading && !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchupSkeleton, {});
	if (query.isError && !data || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-8 text-live" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-lg font-semibold",
				children: "Couldn’t load live scores"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-sm text-sm text-muted",
				children: query.error instanceof Error ? query.error.message : "Try again in a moment."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => query.refetch(),
				className: "rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-fg",
				children: "Retry"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onChangeAccount,
				className: "text-2xs font-semibold text-muted",
				children: "Change account"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "phone-glow min-h-dvh overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto min-h-dvh w-full max-w-md overflow-x-hidden pb-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeagueHeaderButton, {
						name: data.leagueName,
						live: data.liveGames > 0,
						onOpen: () => setPickerOpen(true)
					}),
					tab === "matchup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchupBoard, {
						data,
						onWeek,
						onPlayer: setPlayer,
						viewingOther: Boolean(viewMatchupId && viewMatchupId !== data.myMatchupId),
						onOpenMatchup: openMatchup
					}) : null,
					tab === "team" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamPage, {
						data,
						side: teamSide,
						onSide: setTeamSide,
						onPlayer: setPlayer
					}) : null,
					tab === "players" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayersPage, {
						data,
						onPlayer: setPlayer
					}) : null,
					tab === "league" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaguePage, {
						data,
						onOpenMatchup: openMatchup
					}) : null,
					tab === "feed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedPage, {}) : null,
					tab === "more" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MorePage, {
						data,
						leagues: leagues.data ?? [],
						onOpenLeagues: () => setPickerOpen(true),
						onSelectLeague: selectLeague,
						onChangeAccount
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {
				tab,
				onTab: setTab,
				live: data.liveGames > 0
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerSheet, {
				player,
				week: data.week,
				league: data.leagueSlug,
				onClose: () => setPlayer(null),
				onBackToMatchup: () => {
					setPlayer(null);
					setTab("matchup");
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeagueSheet, {
				open: pickerOpen,
				currentSlug: data.leagueSlug,
				leagues: leagues.data ?? [],
				loading: leagues.isLoading,
				onClose: () => setPickerOpen(false),
				onSelect: selectLeague
			})
		]
	});
}
function AppShell({ profile, requestedWeek, onWeek, onLeague, onChangeAccount }) {
	const client = (0, import_react.useMemo)(() => new QueryClient({ defaultOptions: { queries: {
		retry: 1,
		refetchOnReconnect: true
	} } }), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShellInner, {
			profile,
			requestedWeek,
			onWeek,
			onLeague,
			onChangeAccount
		})
	});
}
var PLATFORMS = [
	{
		id: "sleeper",
		name: "Sleeper",
		blurb: "Live lookup from your @handle",
		find: "Open Sleeper → tap your avatar. The @handle is your username. Type it here — we never fill it in.",
		leagueHint: ""
	},
	{
		id: "espn",
		name: "ESPN",
		blurb: "Live lookup: manager name + league URL",
		find: "Open ESPN Fantasy → your league. Your manager name sits next to your team. Copy it exactly.",
		leagueHint: "League URL looks like fantasy.espn.com/football/league?leagueId=123456"
	},
	{
		id: "yahoo",
		name: "Yahoo",
		blurb: "Live lookup: manager name + league URL",
		find: "Open Yahoo Fantasy → your team. Your manager name is at the top of the page.",
		leagueHint: "League URL looks like football.fantasysports.yahoo.com/f1/12345"
	}
];
function SetupPage({ onReady }) {
	const [platform, setPlatform] = (0, import_react.useState)(null);
	const [username, setUsername] = (0, import_react.useState)("");
	const [leagueRef, setLeagueRef] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [account, setAccount] = (0, import_react.useState)(null);
	const [picked, setPicked] = (0, import_react.useState)([]);
	const meta = PLATFORMS.find((p) => p.id === platform);
	async function lookup() {
		if (!platform) return;
		setError(null);
		setLoading(true);
		try {
			const data = await lookupSleeperAccount({ data: {
				platform,
				username,
				leagueRef: platform === "sleeper" ? void 0 : leagueRef
			} });
			setAccount(data);
			setPicked([]);
		} catch (e) {
			setAccount(null);
			setError(e instanceof Error ? e.message : "Couldn’t find that username");
		} finally {
			setLoading(false);
		}
	}
	function toggle(id) {
		setPicked((cur) => cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
	}
	function finish() {
		if (!account) return;
		const leagues = account.leagues.filter((l) => picked.includes(l.id)).map((l) => ({
			id: l.id,
			name: l.name,
			shortName: l.shortName
		}));
		if (!leagues.length) {
			setError("Pick at least one league");
			return;
		}
		const live = leagues.find((l) => !l.id.startsWith("espn:") && !l.id.startsWith("yahoo:")) ?? leagues[0];
		const profile = {
			platform: account.platform,
			username: account.username,
			userId: account.userId,
			displayName: account.displayName,
			avatar: account.avatar,
			leagues,
			activeLeagueId: live.id
		};
		saveProfile(profile);
		onReady(profile);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "phone-glow mx-auto min-h-dvh w-full max-w-md px-4 pb-10 pt-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-micro font-bold tracking-[0.22em] text-primary",
				children: "LIVELINE"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-2xl font-semibold leading-tight",
				children: "Set up your leagues"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Type your own username. We don’t save a demo account and we don’t fill it in for you."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 text-sm font-semibold",
				children: "Where do you play?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 space-y-2",
				children: PLATFORMS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setPlatform(p.id);
						setAccount(null);
						setError(null);
						setUsername("");
						setLeagueRef("");
						setPicked([]);
					},
					className: cn("flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left", platform === p.id ? "bg-primary/15 shadow-[0_0_0_1px_rgb(92_225_197/0.35)]" : "bg-surface"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold",
						children: p.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-micro text-muted",
						children: p.blurb
					})] }), platform === p.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-subtle" })]
				}, p.id))
			}),
			meta && !account ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6",
				autoComplete: "off",
				onSubmit: (e) => {
					e.preventDefault();
					lookup();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-2xl bg-surface px-3 py-3 text-2xs leading-relaxed text-muted",
						children: meta.find
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-4 block text-sm font-semibold",
						htmlFor: "fantasy-user",
						children: [meta.name, " username"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "fantasy-user",
						name: "liveline-user",
						value: username,
						onChange: (e) => setUsername(e.target.value),
						autoCapitalize: "none",
						autoCorrect: "off",
						autoComplete: "off",
						spellCheck: false,
						placeholder: "type it yourself",
						className: "mt-2 h-12 w-full rounded-2xl bg-surface px-3 text-sm text-fg outline-none placeholder:text-subtle"
					}),
					platform !== "sleeper" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mt-4 block text-sm font-semibold",
							htmlFor: "league-ref",
							children: "League URL or ID"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "league-ref",
							name: "liveline-league",
							value: leagueRef,
							onChange: (e) => setLeagueRef(e.target.value),
							autoCapitalize: "none",
							autoCorrect: "off",
							autoComplete: "off",
							spellCheck: false,
							placeholder: platform === "espn" ? "leagueId=123456" : "/f1/12345",
							className: "mt-2 h-12 w-full rounded-2xl bg-surface px-3 text-sm text-fg outline-none placeholder:text-subtle"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-2xs text-muted",
							children: meta.leagueHint
						})
					] }) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-2xs text-live",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: loading || username.trim().length < 2 || platform !== "sleeper" && leagueRef.trim().length < 3,
						className: "mt-4 flex h-12 w-full items-center justify-center rounded-full bg-primary font-display text-sm font-bold tracking-[0.16em] text-primary-fg disabled:opacity-40",
						children: loading ? "Looking up…" : "Find leagues"
					})
				]
			}) : null,
			account ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-2xl bg-surface px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							src: sleeperAvatar(account.avatar),
							name: account.displayName,
							size: "md"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate font-semibold",
								children: account.displayName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-micro text-muted",
								children: [
									"@",
									account.username,
									" · ",
									account.platform
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-5 text-sm font-semibold",
						children: "Leagues to follow"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-2xs text-muted",
						children: "Tap the ones you want. Live points work on Sleeper leagues."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 space-y-2",
						children: account.leagues.map((lg) => {
							const on = picked.includes(lg.id);
							const live = !lg.id.startsWith("espn:") && !lg.id.startsWith("yahoo:");
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => toggle(lg.id),
								className: cn("flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left", on ? "bg-primary/15" : "bg-surface"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
										src: lg.avatarUrl,
										name: lg.shortName,
										size: "md"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-sm font-semibold",
											children: lg.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-micro text-muted",
											children: [
												lg.season,
												" · ",
												lg.teams,
												" teams",
												live ? " · live" : " · public listing"
											]
										})]
									}),
									on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 shrink-0 text-primary" }) : null
								]
							}, lg.id);
						})
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-2xs text-live",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: finish,
						className: "mt-4 flex h-12 w-full items-center justify-center rounded-full bg-primary font-display text-sm font-bold tracking-[0.16em] text-primary-fg",
						children: "Open LiveLine"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setAccount(null);
							setError(null);
							setUsername("");
							setLeagueRef("");
						},
						className: "mt-3 w-full text-center text-2xs font-semibold text-muted",
						children: "Use a different username"
					})
				]
			}) : null,
			!platform ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex items-start gap-2 text-2xs text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "mt-0.5 size-3.5 text-live" }), "Sleeper, ESPN, and Yahoo lookups are live. You have to type the username from the app."]
			}) : null
		]
	});
}
function Home() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const [profile, setProfile] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setProfile(loadProfile());
	}, []);
	if (!profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SetupPage, { onReady: (next) => {
		setProfile(next);
		navigate({ search: { league: next.activeLeagueId } });
	} });
	const leagueId = search.league && profile.leagues.some((l) => l.id === search.league) ? search.league : profile.activeLeagueId;
	const active = {
		...profile,
		activeLeagueId: leagueId
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		profile: active,
		requestedWeek: search.week,
		onWeek: (week) => {
			navigate({ search: {
				league: leagueId,
				...week ? { week } : {}
			} });
		},
		onLeague: (id) => {
			setActiveLeague(id);
			setProfile({
				...profile,
				activeLeagueId: id
			});
			navigate({ search: { league: id } });
		},
		onChangeAccount: () => {
			clearProfile();
			setProfile(null);
			navigate({ search: {} });
		}
	});
}
//#endregion
export { Home as component };
