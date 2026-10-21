const businessPath = (id: string) => `/businesses/${encodeURIComponent(id)}`;

export const businessEndpoints = {
  detail: businessPath,
  reviews: (id: string) => `${businessPath(id)}/reviews`,
  stats: (id: string) => `${businessPath(id)}/stats`,
  competitors: (id: string) => `${businessPath(id)}/competitors`,
  watchlist: (id: string) => `${businessPath(id)}/watchlist`,
  watchlistItem: (id: string, competitorId: string) =>
    `${businessPath(id)}/watchlist/${encodeURIComponent(competitorId)}`,
} as const;

export const insightEndpoints = {
  topics: (id: string) => `/businesses/${encodeURIComponent(id)}/insights/topics`,
} as const;
