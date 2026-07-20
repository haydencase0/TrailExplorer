const FAVORITES_KEY = "favorite-trails";
const LAST_VIEWED_KEY = "last-viewed-trail";

export function readFavorites() {
  try{
    const value = localStorage.getItem(FAVORITES_KEY);
    return value ? JSON.parse(value) : [];
  }
  catch {
    console.log("JSON storage error")
  }
}

export function saveFavorites(list) {
  try{
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
  }
  catch{
    console.log("Couldn't save favorite")
  }
}

export function addFavorite(trail) {
  try {
    const favorites = readFavorites();
    const exists = favorites.some((t) => t.id === trail.id);
    if (!exists) {
      favorites.push(trail);
      saveFavorites(favorites);
    }
  }
  catch{
    console.log("Error adding favorite trail")
  }  
}

export function removeFavorite(trailId) {
  try{
    const updated = readFavorites().filter((t) => t.id !== trailId);
    saveFavorites(updated);
    return updated;
  }
  catch {
    console.log("Error removing favorite trail")
  }
}

export function readLastViewed() {
  try{
    return localStorage.getItem(LAST_VIEWED_KEY) ?? null;
  }
  catch{
    console.log("Couldn't load last viewed")
  }
}

export function saveLastViewed(trailId) {
  try{
    localStorage.setItem(LAST_VIEWED_KEY, trailId);
  }
  catch{
    console.log("Couldn't save last viewed")
  }
}