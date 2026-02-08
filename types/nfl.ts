// ESPN NFL API Type Definitions

export interface GameData {
  leagues: League[];
  season: Season;
  week: Week;
  events: Event[];
}

export interface League {
  id: string;
  uid: string;
  name: string;
  abbreviation: string;
  slug: string;
  season: Season;
  logos: Logo[];
  calendarType: string;
  calendarIsWhitelist: boolean;
  calendarStartDate: string;
  calendarEndDate: string;
  calendar: string[];
}

export interface Season {
  year: number;
  type: number;
  name: string;
  displayName: string;
}

export interface Week {
  number: number;
  startDate: string;
  endDate: string;
  text: string;
}

export interface Event {
  id: string;
  uid: string;
  date: string;
  name: string;
  shortName: string;
  season: Season;
  week: Week;
  competitions: Competition[];
  links: Link[];
  status: Status;
}

export interface Competition {
  id: string;
  uid: string;
  date: string;
  attendance: number;
  type: CompetitionType;
  timeValid: boolean;
  neutralSite: boolean;
  conferenceCompetition: boolean;
  playByPlayAvailable: boolean;
  recent: boolean;
  venue: Venue;
  competitors: Competitor[];
  notes: Note[];
  status: Status;
  broadcasts: Broadcast[];
  leaders?: Leader[];
  situation?: Situation;
}

export interface CompetitionType {
  id: string;
  abbreviation: string;
}

export interface Venue {
  id: string;
  fullName: string;
  address: Address;
  capacity: number;
  indoor: boolean;
}

export interface Address {
  city: string;
  state: string;
}

export interface Competitor {
  id: string;
  uid: string;
  type: string;
  order: number;
  homeAway: "home" | "away";
  team: Team;
  score: string;
  linescores?: LineScore[];
  statistics?: Statistic[];
  records?: Record[];
}

export interface Team {
  id: string;
  uid: string;
  location: string;
  name: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  color: string;
  alternateColor: string;
  isActive: boolean;
  venue: TeamVenue;
  links: Link[];
  logo: string;
}

export interface TeamVenue {
  id: string;
}

export interface LineScore {
  value: number;
}

export interface Statistic {
  name: string;
  abbreviation: string;
  displayValue: string;
  label: string;
}

export interface Record {
  name: string;
  abbreviation?: string;
  type: string;
  summary: string;
}

export interface Note {
  type: string;
  headline: string;
}

export interface Status {
  clock: number;
  displayClock: string;
  period: number;
  type: StatusType;
}

export interface StatusType {
  id: string;
  name: string;
  state: "pre" | "in" | "post";
  completed: boolean;
  description: string;
  detail: string;
  shortDetail: string;
}

export interface Broadcast {
  market: string;
  names: string[];
}

export interface Leader {
  name: string;
  displayName: string;
  shortDisplayName: string;
  abbreviation: string;
  leaders: LeaderDetail[];
}

export interface LeaderDetail {
  displayValue: string;
  value: number;
  athlete: Athlete;
  team: TeamReference;
}

export interface Athlete {
  id: string;
  fullName: string;
  displayName: string;
  shortName: string;
  links: Link[];
  headshot: string;
  jersey: string;
  position: Position;
  team: TeamReference;
  active: boolean;
}

export interface Position {
  abbreviation: string;
}

export interface TeamReference {
  id: string;
}

export interface Situation {
  lastPlay: LastPlay;
  down: number;
  yardLine: number;
  distance: number;
  downDistanceText: string;
  shortDownDistanceText: string;
  possessionText: string;
  isRedZone: boolean;
  homeTimeouts: number;
  awayTimeouts: number;
}

export interface LastPlay {
  id: string;
  type: PlayType;
  text: string;
  scoreValue: number;
  team: TeamReference;
  probability: Probability;
  drive: Drive;
  start: PlayDetails;
  end: PlayDetails;
  statYardage: number;
}

export interface PlayType {
  id: string;
  text: string;
  abbreviation: string;
}

export interface Probability {
  tiePercentage: number;
  homeWinPercentage: number;
  awayWinPercentage: number;
  secondsLeft: number;
}

export interface Drive {
  description: string;
  start: DriveDetails;
  timeElapsed: DriveTime;
}

export interface DriveDetails {
  yardLine: number;
  text: string;
}

export interface DriveTime {
  displayValue: string;
}

export interface PlayDetails {
  down: number;
  distance: number;
  yardLine: number;
  yardsToEndzone: number;
  team: TeamReference;
}

export interface Link {
  language?: string;
  rel: string[];
  href: string;
  text: string;
  shortText?: string;
  isExternal: boolean;
  isPremium: boolean;
}

export interface Logo {
  href: string;
  width: number;
  height: number;
  alt: string;
  rel: string[];
  lastUpdated: string;
}
