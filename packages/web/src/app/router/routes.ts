export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  EXPLORE: "/explore/:type",
  EXPLORE_MOVIES: "/explore/movie",
  EXPLORE_TV: "/explore/tv",
  EXPLORE_GAMES: "/explore/game",
  EXPLORE_BOOKS: "/explore/book",
  EXPLORE_ANIME: "/explore/anime",
  EXPLORE_MANGA: "/explore/manga",
  LIBRARY: "/library",
  LIBRARY_ITEM: "/library/:id",
} as const;
