export interface Advantage {
  key: string;
  type: string;
  lastFoundAt: string;
  createdAt: string;
  market: {
    key: string;
    type: string;
    segment: string;
    lastFoundAt: string;
    event: {
      key: string;
      name: string;
      startTime: string;
      homeParticipantKey: string;
      participants: {
        key: string;
        name: string;
        sport: string;
      }[];
      competitionInstance: {
        key: string;
        name: string;
        competitionKey: string;
        startAt: string;
        endAt: string;
        competition: {
          key: string;
          slug: string;
          name: string;
          shortName: string;
          sport: string;
        };
      };
    };
    outcomes: {
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
      participant: {
        key: string;
        name: string;
        sport: string;
      };
    }[];
    marketStatistics: unknown[];
  };
}

export interface EventDetails {
  event: {
    tournament: {
      name: string;
      slug: string;
    };
    season: {
      name: string;
      year: string;
    };
    status: {
      code: number;
      description: string;
      type: string;
    };
    homeTeam: {
      name: string;
      slug: string;
      shortName: string;
    };
    awayTeam: {
      name: string;
      slug: string;
      shortName: string;
    };
    homeScore: {
      current: number;
      display: number;
      period1: number;
      period2: number;
      normaltime: number;
    };
    awayScore: {
      current: number;
      display: number;
      period1: number;
      period2: number;
      normaltime: number;
    };
    startTimestamp: number;
  };
}
