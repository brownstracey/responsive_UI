// main.js - bootstraps app
import { setupUI } from './ui.js';

// load seed.json dynamically (it's local file), fallback to embedded seed if fetch fails
async function loadSeed() {
  try {
    const resp = await fetch('seed.json');
    if (!resp.ok) throw new Error('seed missing');
    const json = await resp.json();
    return json;
  } catch (e) {
    console.warn('Could not load seed.json', e);
    return [];
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const seed = await loadSeed();
  setupUI(seed);

  // keyboard focus outline improvement: only show on keyboard nav
  (function () {
    const handleMouse = () => document.body.classList.add('using-mouse');
    const handleKey = (e) => {
      if (e.key === 'Tab') document.body.classList.remove('using-mouse');
    };
    document.addEventListener('mousedown', handleMouse);
    document.addEventListener('keydown', handleKey);
  })();

  // 🩷 Dashboard Card Navigation
  const dashButtons = document.querySelectorAll(".dash-card");

  dashButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetPage = btn.dataset.link; // changed from data-target to data-link
      if (targetPage) {
        window.location.href = targetPage; // go to the linked page
      } else {
        console.warn("No link found for:", btn);
      }
    });
  });
});
