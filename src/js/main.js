import { fetchTrailsData } from "./data.js";
import { addFavorite, readLastViewed, saveLastViewed } from "./storage.js";
import {
  renderCurrentTrail,
  renderTrailInfo,
  renderFavoriteChips,
  renderTrailSelectorUI,
  renderFormTrailOptions,
  renderMapEmbed,
  setActiveView,
} from "./render.js";

const DEFAULT_TRAIL_ID = "mink-creek-trail";

let allTrails = [];
let activeTrail = null;

function getInitialTrail(trails) {
  const params = new URLSearchParams(window.location.search);
  const idFromUrl = params.get("trail");
  const idFromStorage = readLastViewed();
  const id = idFromUrl || idFromStorage || DEFAULT_TRAIL_ID;
  return trails.find((t) => t.id === id) ?? trails[0];
}

function buildTrailUrl(trailId) {
  return `${window.location.pathname}?trail=${trailId}`;
}

function setActiveTrail(trail) {
  if (!trail) return;
  activeTrail = trail;
  saveLastViewed(trail.id);
  renderCurrentTrail(trail);
  renderTrailInfo(trail);
  renderFormTrailOptions(allTrails, trail.id);
  renderMapEmbed(trail);
  history.pushState(null, "", buildTrailUrl(trail.id));
}

// Mobile menu toggle
function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Nav tab switching
function initNavTabs() {
  document.querySelectorAll(".site-nav__link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const view = link.dataset.view;
      if (view === "form") {
        openModal();
      } else {
        setActiveView(view);
      }
    });
  });
}

// Modal
function openModal() {
  const overlay = document.getElementById("modalOverlay");
  if (!overlay) return;
  overlay.classList.add("is-open");
  if (activeTrail) {
    const select = document.getElementById("hikerTrail");
    if (select) select.value = activeTrail.id;
  }
  document.getElementById("hikerName")?.focus();
}

function closeModal() {
  document.getElementById("modalOverlay")?.classList.remove("is-open");
}

function initModal() {
  document.getElementById("planHikeBtn")?.addEventListener("click", openModal);
  document.getElementById("modalClose")?.addEventListener("click", closeModal);

  document.getElementById("modalOverlay")?.addEventListener("click", (e) => {
    if (e.target === document.getElementById("modalOverlay")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  document.getElementById("planHikeForm")?.addEventListener("submit", (e) => {
    const name = document.getElementById("hikerName").value
    const email = document.getElementById("hikerEmail")
    const errorContainer = document.getElementById('errorMessage');
    const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    e.preventDefault();
    try{
      if(!nameRegex.test(name)){
        throw new Error('Invalid Name');
      }
      if(!email.checkValidity()){
        throw new Error('Invalid Email');
      }
      const data = Object.fromEntries(new FormData(e.target));
      console.log("Hike planned:", data);
      // Save the selected trail to favorites when the form is submitted
      const submittedTrail = allTrails.find((t) => t.id === data.hikerTrail);
      if (submittedTrail) {
        addFavorite({ id: submittedTrail.id, name: submittedTrail.name });
        renderFavoriteChips(allTrails, setActiveTrail);
      }
      closeModal();
      e.target.reset();
    } catch (error){
      errorContainer.textContent = error.message;
    }
  });
}

// Save trail button (heart)
function initSaveTrail() {
  document.getElementById("saveTrailBtn")?.addEventListener("click", () => {
    if (!activeTrail) return;
    addFavorite({ id: activeTrail.id, name: activeTrail.name });
    renderFavoriteChips(allTrails, setActiveTrail);
  });
}

async function init() {
  try {
    allTrails = await fetchTrailsData();
  } catch (err) {
    console.error("Could not load trails:", err);
    return;
  }

  if (!allTrails.length) return;

  const trail = getInitialTrail(allTrails);
  setActiveTrail(trail);
  setActiveView("trails");

  renderFavoriteChips(allTrails, setActiveTrail);

  renderTrailSelectorUI(allTrails, trail.id, (selected) => {
    setActiveTrail(selected);
    renderFavoriteChips(allTrails, setActiveTrail);
  });

  initMobileMenu();
  initNavTabs();
  initModal();
  initSaveTrail();
}

init();