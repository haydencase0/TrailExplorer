import { readFavorites, removeFavorite } from "./storage.js";

const TRAIL_IMAGE_BASE = "/images";
const TRAIL_IMAGE_FALLBACK = `${TRAIL_IMAGE_BASE}/placeholder.jpg`;

function setTrailImage(trail, imgEl) {
  if (!imgEl) return;
  const id = (trail?.id ?? "").toLowerCase().trim();
  imgEl.src = id ? `${TRAIL_IMAGE_BASE}/${id}.jpg` : TRAIL_IMAGE_FALLBACK;
  imgEl.alt = trail?.name ? `${trail.name} trail` : "Trail image";
  imgEl.onerror = () => {
    imgEl.onerror = null;
    imgEl.src = TRAIL_IMAGE_FALLBACK;
  };
}

export function renderCurrentTrail(trail) {
  if (!trail) return;

  const nameEl = document.getElementById("current-trail-name");
  const imageEl = document.getElementById("current-trail-image");
  const descEl = document.getElementById("current-trail-desc");
  const linkEl = document.getElementById("current-trail-link");

  if (nameEl) nameEl.textContent = trail.name;
  if (descEl) descEl.textContent = trail.description ?? "";
  if (linkEl) {
    linkEl.href = trail.link ?? "#";
    linkEl.style.display = trail.link ? "inline" : "none";
  }

  setTrailImage(trail, imageEl);

  document.title = `${trail.name} | Idaho Trail Explorer`;
}

export function renderTrailInfo(trail) {
  if (!trail) return;

  const distanceEl = document.getElementById("info-distance");
  const elevationEl = document.getElementById("info-elevation");
  const difficultyEl = document.getElementById("info-difficulty");
  const surfaceEl = document.getElementById("info-surface");
  const areaEl = document.getElementById("info-area");

  if (distanceEl) {
    distanceEl.textContent = trail.distance_miles ? `${trail.distance_miles} mi` : "N/A";
  }
  if (elevationEl) {
    elevationEl.textContent = trail.elevation_gain_ft
      ? `${trail.elevation_gain_ft.toLocaleString()} ft`
      : "N/A";
  }
  if (difficultyEl) {
    difficultyEl.textContent = trail.difficulty ?? "N/A";
    difficultyEl.className = "info-card__value";
    const level = trail.difficulty?.toLowerCase() ?? "";
    if (level.includes("moderate") || level.includes("challenging")) {
      difficultyEl.classList.add("info-card__value--accent");
    }
  }
  if (surfaceEl) surfaceEl.textContent = trail.surface ?? "N/A";
  if (areaEl) areaEl.textContent = trail.area ?? "N/A";
}

export function renderFavoriteChips(trails, onChipClick) {
  const section = document.querySelector(".favorites");
  const container = document.getElementById("favorites-list");
  if (!container) return;

  const favorites = readFavorites();

  if (!favorites.length) {
    section?.classList.add("is-hidden");
    container.innerHTML = "";
    return;
  }

  section?.classList.remove("is-hidden");

  container.innerHTML = favorites
    .map(
      (fav) => `
      <span class="trail-chip" data-trail-id="${fav.id}">
        ${fav.name}
        <button class="trail-chip__remove" data-trail-id="${fav.id}" aria-label="Remove ${fav.name} from favorites">&times;</button>
      </span>
    `
    )
    .join("");

  container.querySelectorAll(".trail-chip").forEach((chip) => {
    chip.addEventListener("click", (e) => {
      if (e.target.classList.contains("trail-chip__remove")) return;
      const trail = trails.find((t) => t.id === chip.dataset.trailId);
      if (trail) onChipClick(trail);
    });
  });

  container.querySelectorAll(".trail-chip__remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeFavorite(btn.dataset.trailId);
      renderFavoriteChips(trails, onChipClick);
    });
  });
}

export function renderTrailSelectorUI(trails, currentTrailId, onTrailSelected) {
  const btn = document.getElementById("choose-trail-btn");
  const select = document.getElementById("choose-trail-select");

  select.innerHTML = `
    <option value="">Select a trail...</option>
    ${trails
      .map(
        (t) =>
          `<option value="${t.id}" ${t.id === currentTrailId ? "selected" : ""}>${t.name}</option>`
      )
      .join("")}
  `;

  select.addEventListener("change", () => {
    const trail = trails.find((t) => t.id === select.value);
    if (trail) {
      onTrailSelected(trail);
    }
  });
}

export function renderFormTrailOptions(trails, currentTrailId) {
  const select = document.getElementById("hikerTrail");
  if (!select) return;

  select.innerHTML = `
    <option value="">Choose a trail</option>
    ${trails
      .map(
        (t) =>
          `<option value="${t.id}" ${t.id === currentTrailId ? "selected" : ""}>${t.name}</option>`
      )
      .join("")}
  `;
}

export function renderMapEmbed(trail) {
  const iframe = document.getElementById("map-frame");
  if (!iframe || !trail) return;
  const query = encodeURIComponent(`${trail.name} ${trail.area} Idaho`);
  iframe.src = `https://www.google.com/maps/search/?api=1&query=${query}&output=embed`;
}

export function setActiveView(view) {
  const trailsView = document.getElementById("trails-view");
  const mapView = document.getElementById("map-view");

  if (trailsView) trailsView.classList.toggle("is-hidden", view !== "trails");
  if (mapView) mapView.classList.toggle("is-hidden", view !== "map");

  document.querySelectorAll(".site-nav__link").forEach((link) => {
    link.classList.toggle("site-nav__link--active", link.dataset.view === view);
  });
}