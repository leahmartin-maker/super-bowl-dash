// Super Bowl Prop Betting Types

export interface GameInfo {
  title: string;
  date: string;
  venue: string;
  teams: {
    afc: TeamInfo;
    nfc: TeamInfo;
  };
  halftimePerformer: string;
}

export interface TeamInfo {
  name: string;
  abbreviation: string;
  conference: string;
}

export interface Scoring {
  pointsPerCorrectPick: number;
  tiebreaker: string;
}

export interface PropOption {
  id: string;
  label: string;
}

export interface Prop {
  id: string;
  question: string;
  type: 'single-choice' | 'yes-no' | 'team-choice' | 'player-input' | 'text-input';
  options?: PropOption[];
  placeholder?: string;
  correct_answer?: string; // Added for UI/backend compatibility
}

export interface PropCategory {
  id: string;
  name: string;
  icon: string;
  props: Prop[];
}

export interface PropBetsData {
  gameInfo: GameInfo;
  scoring: Scoring;
  categories: PropCategory[];
}

export interface UserPick {
  propId: string;
  categoryId: string;
  answer: string;
}

export interface UserSheet {
  userName: string;
  picks: UserPick[];
  tiebreakerScore?: number;
  totalPoints?: number;
  submittedAt?: string;
}
