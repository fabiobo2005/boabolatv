export type Sport = 'tennis' | 'padel' | 'squash' | 'badminton' | 'table-tennis';

export type ShotType = 
  | 'ace'
  | 'double-fault'
  | 'forehand-winner'
  | 'backhand-winner'
  | 'forehand-unforced-error'
  | 'backhand-unforced-error'
  | 'serve-unforced-error'
  | 'volley-winner'
  | 'volley-error'
  | 'overhead-winner'
  | 'overhead-error'
  | 'drop-shot-winner'
  | 'drop-shot-error'
  | 'lob-winner'
  | 'lob-error'
  | 'net-point';

export type PointResult = 'winner' | 'unforced-error' | 'forced-error';

export interface Player {
  id: string;
  name: string;
  country: string;
  ranking: number;
  imageUrl?: string;
}

export interface PointDetail {
  timestamp: Date;
  winner: 'player1' | 'player2';
  shotType: ShotType;
  result: PointResult;
  description?: string;
}

export interface SetScore {
  player1: number;
  player2: number;
  tiebreak?: {
    player1: number;
    player2: number;
  };
}

export interface GameScore {
  player1: number; // 0, 15, 30, 40, AD
  player2: number;
}

export interface MatchStats {
  id: string;
  sport: Sport;
  player1: Player;
  player2: Player;
  sets: SetScore[];
  currentGame: GameScore;
  currentServer: 'player1' | 'player2';
  isLive: boolean;
  startTime: Date;
  endTime?: Date;
  points: PointDetail[];
  statistics: {
    player1: PlayerStats;
    player2: PlayerStats;
  };
}

export interface PlayerStats {
  aces: number;
  doubleFaults: number;
  firstServePercentage: number;
  secondServePercentage: number;
  firstServePointsWon: number;
  secondServePointsWon: number;
  breakPointsSaved: number;
  breakPointsConverted: number;
  totalPointsWon: number;
  forehandWinners: number;
  forehandErrors: number;
  backhandWinners: number;
  backhandErrors: number;
  netPoints: number;
  netPointsWon: number;
}

export interface H2HRecord {
  player1: Player;
  player2: Player;
  player1Wins: number;
  player2Wins: number;
  matches: MatchStats[];
}
