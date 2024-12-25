export interface ApiResponse {
  advantages: Advantage[];
}

export interface Advantage {
  key: string;
  type: string;
  lastFoundAt: string;
  createdAt: string;
  market: Market;
  outcomes: Outcome[];
}

export interface Market {
  key: string;
  type: "MONEYLINE" | "POINT_SPREAD";
  segment: string;
  lastFoundAt: string;
  event: Event;
}

export interface Event {
  key: string;
  name: string;
  startTime: string;
  homeParticipantKey: string;
  participants: Participant[];
  competitionInstance: CompetitionInstance;
}

export interface Participant {
  key: string;
  name: string;
  sport: string;
}

export interface CompetitionInstance {
  key: string;
  name: string;
  competitionKey: string;
  startAt: string;
  endAt: string;
}

export interface Competition {
  key: string;
  slug: string;
  name: string;
  shortName: string;
  sport: string;
  category: string;
  competitionInstances: CompetitionInstance[];
}

export interface Outcome {
  key: string;
  modifier: number;
  payout: number;
  type: string;
  live: boolean;
  readAt: string;
  lastFoundAt: string;
  source: string;
  marketKey: string;
  participantKey: string;
  participant: Participant;
}

export interface CompetitionsResponse {
  competitions: Competition[];
}
