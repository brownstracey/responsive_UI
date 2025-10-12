// main.js — Campus Life Planner
import { setupUI } from './ui.js';

// Load seed.json dynamically (local file)
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

// ✅ One unified DOMContentLoaded block
document.addEventListener('DOMContentLoaded', async () => {
  const seed = await loadSeed();
  setupUI(seed);

  // Keyboard focus outline improvement
  (function () {
    const handleMouse = () => document.body.classList.add('using-mouse');
    const handleKey = (e) => {
      if (e.key === 'Tab') document.body.classList.remove('using-mouse');
    };
    document.addEventListener('mousedown', handleMouse);
    document.addEventListener('keydown', handleKey);
  })();

  // 🩷 Dashboard Button Navigation (scrolls to section)
  document.querySelectorAll('.dash-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const section = document.querySelector(target);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.warn('No target found for:', target);
      }
    });
  });
});
