export type GameState = "pre" | "in" | "post" | "bye";

export type SlotPos = "QB" | "RB" | "WR" | "TE" | "FLEX" | "K" | "DEF" | "BN";

export type AppTab = "matchup" | "team" | "players" | "league" | "feed" | "more";

export type LiveTicker = {
  eventId: string;
  detail: string;
  downDistance: string | null;
  playText: string | null;
  homeAbbr: string;
  awayAbbr: string;
  homeScore: string;
  awayScore: string;
  possession: "home" | "away" | null;
  broadcast: string | null;
  playerHeadshot: string | null;
  playerName: string | null;
  fantasyDelta: number | null;
};

export type GameInfo = {
  state: GameState;
  start: string | null;
  startLabel: string;
  opponent: string | null;
  homeAway: "home" | "away" | null;
  progress: number;
  clock: string | null;
  period: string | null;
  score: string | null;
  eventId: string | null;
};

export type PlayerView = {
  id: string;
  name: string;
  shortName: string;
  firstName: string;
  lastName: string;
  pos: string;
  slot: SlotPos;
  team: string | null;
  teamRank: number | null;
  injury: string | null;
  headshot: string;
  espnId: string | null;
  number: number | null;
  points: number | null;
  projection: number;
  remaining: number;
  projectedLive: number;
  statLine: string | null;
  game: GameInfo;
};

export type TeamView = {
  rosterId: number;
  userId: string;
  teamName: string;
  displayName: string;
  username: string;
  avatarUrl: string;
  wins: number;
  losses: number;
  ties: number;
  rank: number;
  points: number;
  projected: number;
  remaining: number;
  winPct: number;
  pointsAgainst: number;
  maxPf: number;
  waiverPosition: number;
  totalMoves: number;
  starters: PlayerView[];
  bench: PlayerView[];
  yetToPlay: number;
  yetToPlaySummary: string;
  playingCount: number;
};

export type OtherMatchup = {
  matchupId: number;
  leftName: string;
  rightName: string;
  leftPoints: number;
  rightPoints: number;
  leftAvatar: string;
  rightAvatar: string;
  leftRecord: string;
  rightRecord: string;
  leftRank: number;
  rightRank: number;
  isFeatured: boolean;
  isMine: boolean;
  isLive: boolean;
};

export type StandingRow = {
  rosterId: number;
  rank: number;
  teamName: string;
  displayName: string;
  avatarUrl: string;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  maxPf: number;
  waiverPosition: number;
  isLeft: boolean;
  isRight: boolean;
  division: number | null;
};

export type ActivityItem = {
  id: string;
  type: string;
  status: string;
  created: number;
  teamName: string;
  avatarUrl: string;
  adds: { id: string; name: string }[];
  drops: { id: string; name: string }[];
};

export type LeagueInfo = {
  name: string;
  avatarUrl: string;
  season: string;
  teams: number;
  playoffTeams: number;
  playoffWeekStart: number;
  scoringLabel: string;
  rec: number;
  passTd: number;
  rushTd: number;
  keeper: boolean;
  tradeDeadline: number;
  waiverDay: string;
  lastWinnerRosterId: number | null;
  lastWinnerName: string | null;
  divisions: DivisionGroup[];
};

export type DivisionGroup = {
  id: number;
  name: string;
  rows: StandingRow[];
};

export type LeaguePlayer = {
  id: string;
  name: string;
  shortName: string;
  pos: string;
  team: string | null;
  injury: string | null;
  headshot: string;
  espnId: string | null;
  rosterId: number | null;
  ownerName: string;
  projection: number;
};

export type MatchupPayload = {
  week: number;
  displayWeek: number;
  season: string;
  leagueId: string;
  leagueSlug: string;
  leagueName: string;
  updatedAt: string;
  isHeadToHead: boolean;
  myMatchupId: number | null;
  left: TeamView;
  right: TeamView;
  ticker: LiveTicker | null;
  liveGames: number;
  otherMatchups: OtherMatchup[];
  standings: StandingRow[];
  activity: ActivityItem[];
  league: LeagueInfo;
  leaguePlayers: LeaguePlayer[];
};

export type StatCell = {
  key: string;
  label: string;
  value: string;
};

export type ScoringPlay = {
  id: string;
  period: string;
  clock: string;
  downDistance: string | null;
  text: string;
  points: number;
  isTd: boolean;
};

export type GameLogRow = {
  week: number;
  dateLabel: string;
  opponent: string;
  homeAway: "home" | "away" | "@" | "vs";
  result: string | null;
  fantasyPts: number | null;
  line: StatCell[];
};

export type NewsItem = {
  id: string;
  headline: string;
  description: string;
  published: string;
  publishedLabel: string;
  image: string | null;
};

export type PlayerDetail = {
  playerId: string;
  espnId: string | null;
  name: string;
  shortName: string;
  pos: string;
  team: string | null;
  number: number | null;
  headshot: string;
  week: number;
  season: string;
  gameStats: StatCell[];
  extraStats: StatCell[];
  scoringPlays: ScoringPlay[];
  gameLog: GameLogRow[];
  seasonStats: StatCell[];
  lastSeasonStats: StatCell[];
  careerStats: StatCell[];
  news: NewsItem[];
  opponent: string | null;
  homeAway: "home" | "away" | null;
  gameLabel: string;
  fantasyPts: number | null;
  projection: number;
};

export type TrendingPlayer = {
  id: string;
  name: string;
  shortName: string;
  pos: string;
  team: string | null;
  headshot: string;
  count: number;
  kind: "add" | "drop";
  espnId: string | null;
};

export type LeaguePickerItem = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  avatarUrl: string;
  season: string;
  teams: number;
  scoringLabel: string;
  myTeamName: string;
  myAvatar: string;
  myPoints: number;
  myRecord: string;
  oppName: string;
  oppAvatar: string;
  oppPoints: number;
  week: number;
};

export type FeedStory = {
  id: string;
  headline: string;
  description: string;
  published: string;
  publishedLabel: string;
  image: string | null;
  url: string | null;
  byline: string | null;
  teams: string[];
};

export type FeedArticle = FeedStory & {
  paragraphs: string[];
};

export type AccountLookup = {
  platform: "sleeper" | "espn" | "yahoo";
  userId: string;
  username: string;
  displayName: string;
  avatar: string | null;
  leagues: Array<{
    id: string;
    name: string;
    shortName: string;
    season: string;
    teams: number;
    avatarUrl: string;
  }>;
};


