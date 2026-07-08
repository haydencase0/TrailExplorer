const FAVORITES_KEY = "favorite-trails";
const LAST_VIEWED_KEY = "last-viewed-trail";

export function readFavorites() {
  const value = localStorage.getItem(FAVORITES_KEY);
  return value ? JSON.parse(value) : [];
}

export function saveFavorites(list) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

export function addFavorite(trail) {
  const favorites = readFavorites();
  const exists = favorites.some((t) => t.id === trail.id);
  if (!exists) {
    favorites.push(trail);
    saveFavorites(favorites);
  }
}

export function removeFavorite(trailId) {
  const updated = readFavorites().filter((t) => t.id !== trailId);
  saveFavorites(updated);
  return updated;
}

export function readLastViewed() {
  return localStorage.getItem(LAST_VIEWED_KEY) ?? null;
}

export function saveLastViewed(trailId) {
  localStorage.setItem(LAST_VIEWED_KEY, trailId);
}