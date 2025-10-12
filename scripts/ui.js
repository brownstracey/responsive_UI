// ui.js - DOM rendering and event wiring
import { STATE, initState, addRecord, updateRecord, deleteRecord, importRecords } from './state.js';
import { validateRecord } from './validators.js';
import { compileRegex, highlight } from './search.js';
import { loadSettings, saveSettings } from './storage.js';

const selectors = {
  list: '#list',
  form: '#recordForm',
  title:'#title', dueDate:'#dueDate', duration:'#duration', tag:'#tag', recordId:'#recordId',
  titleError:'#titleError', dateError:'#dateError', durationError:'#durationError', tagError:'#tagError',
  sortSelect:'#sortSelect', searchInput:'#searchInput', caseToggle:'#caseToggle', searchError:'#searchError',
  stats:'#stats', trend:'#trend', capInput:'#capInput', capSave:'#capSave', capMessage:'#capMessage',
  exportBtn:'#exportBtn', importFile:'#importFile', importError:'#importError',
  units:'#units', saveSettings:'#saveSettings', resetSettings:'#resetSettings',
  resetBtn:'#resetBtn'
};

export function setupUI(seed){
  initState(seed);
  bindElements();
  renderAll();
}

function $(s){ return document.querySelector(s) }
function $all(s){ return Array.from(document.querySelectorAll(s)) }

function bindElements(){
  const form = $(selectors.form);
  form.addEventListener('submit', onSave);
  $(selectors.resetBtn).addEventListener('click', onFormReset);

  $(selectors.sortSelect).addEventListener('change', renderList);
  $(selectors.searchInput).addEventListener('input', onSearchInput);
  $(selectors.caseToggle).addEventListener('change', renderList);

  $(selectors.exportBtn).addEventListener('click', onExport);
  $(selectors.importFile).addEventListener('change', onImportFile);

  $(selectors.capSave).addEventListener('click', onSaveCap);

  $(selectors.saveSettings).addEventListener('click', onSaveSettings);
  $(selectors.resetSettings).addEventListener('click', onResetSettings);

  // keyboard nav for list
  $(selectors.list).addEventListener('keydown', (e)=>{
    if(e.key === 'Delete' && document.activeElement.closest('.card')){
      const id = document.activeElement.closest('.card').dataset.id;
      onDelete(id);
    }
  });

  // initial settings into UI
  const s = STATE.settings || {};
  $(selectors.units).value = s.units || 'minutes';
  $(selectors.capInput).value = s.cap || '';
}

function renderAll(){
  renderList();
  renderStats();
  renderTrend();
}

function renderList(){
  const list = $(selectors.list);
  list.innerHTML = '';
  const q = $(selectors.searchInput).value.trim();
  const flags = $(selectors.caseToggle).checked ? '' : 'i';
  const re = compileRegex(q, flags);
  if(q && !re){
    $(selectors.searchError).textContent = 'Invalid regex';
  } else {
    $(selectors.searchError).textContent = '';
  }

  const sort = $(selectors.sortSelect).value;
  const items = [...STATE.records];
  items.sort(getSortFn(sort));

  if(items.length===0){
    list.innerHTML = '<p class="small-muted">No records yet. Add one in Add / Edit.</p>';
    return;
  }

  for(const r of items){
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('tabindex','0');
    card.dataset.id = r.id;

    // left meta
    const meta = document.createElement('div');
    meta.className = 'meta';
    const title = document.createElement('div');
    title.className = 'title';
    title.innerHTML = re ? highlight(r.title, re) : escapeHtml(r.title);
    meta.appendChild(title);

    const small = document.createElement('div');
    small.className = 'small-muted';
    small.innerHTML = `${escapeHtml(r.tag)} • ${escapeHtml(r.date)} • ${displayDuration(r.duration)}`;
    meta.appendChild(small);

    // actions
    const actions = document.createElement('div');
    actions.className = 'row';
    const edit = document.createElement('button');
    edit.textContent = 'Edit';
    edit.setAttribute('aria-label', `Edit ${r.title}`);
    edit.addEventListener('click', ()=>populateForm(r));
    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.setAttribute('aria-label', `Delete ${r.title}`);
    del.addEventListener('click', ()=>onDelete(r.id));
    actions.appendChild(edit);
    actions.appendChild(del);

    card.appendChild(meta);
    card.appendChild(actions);

    list.appendChild(card);
  }
}

function getSortFn(sort){
  if(sort === 'date_desc') return (a,b)=> b.date.localeCompare(a.date);
  if(sort === 'date_asc') return (a,b)=> a.date.localeCompare(b.date);
  if(sort === 'title_az') return (a,b)=> a.title.localeCompare(b.title);
  if(sort === 'title_za') return (a,b)=> b.title.localeCompare(a.title);
  if(sort === 'dur_desc') return (a,b)=> b.duration - a.duration;
  if(sort === 'dur_asc') return (a,b)=> a.duration - b.duration;
  return ()=>0;
}

function populateForm(r){
  $(selectors.recordId).value = r.id;
  $(selectors.title).value = r.title;
  $(selectors.dueDate).value = r.date;
  $(selectors.duration).value = r.duration;
  $(selectors.tag).value = r.tag;
  $(selectors.title).focus();
}

function onFormReset(){
  $(selectors.recordId).value = '';
  $(selectors.form).reset();
  // clear errors
  clearErrors();
}

function onSave(e){
  e.preventDefault();
  clearErrors();
  const id = $(selectors.recordId).value;
  const payload = {
    title: $(selectors.title).value,
    date: $(selectors.dueDate).value,
    duration: $(selectors.duration).value,
    tag: $(selectors.tag).value
  };
  const {valid, errors} = validateRecord(payload);
  if(!valid){
    showFieldErrors(errors);
    return;
  }
  try{
    if(id){
      updateRecord(id, payload);
    } else {
      addRecord(payload);
    }
    // update UI
    renderAll();
    onFormReset();
  } catch(err){
    alert('Save failed: ' + err.message);
  }
}

function showFieldErrors(errors){
  if(errors.title) $(selectors.titleError).textContent = errors.title;
  if(errors.date) $(selectors.dateError).textContent = errors.date;
  if(errors.duration) $(selectors.durationError).textContent = errors.duration;
  if(errors.tag) $(selectors.tagError).textContent = errors.tag;
}

function clearErrors(){
  $(selectors.titleError).textContent = '';
  $(selectors.dateError).textContent = '';
  $(selectors.durationError).textContent = '';
  $(selectors.tagError).textContent = '';
  $(selectors.importError).textContent = '';
}

function onDelete(id){
  if(!confirm('Delete this record?')) return;
  deleteRecord(id);
  renderAll();
}

// search input handling with try/catch for regex
function onSearchInput(){
  renderList();
}

function onExport(){
  const data = JSON.stringify(STATE.records, null, 2);
  const blob = new Blob([data], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'campus-records.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

import { validateImport } from './storage.js';

function onImportFile(e){
  const f = e.target.files[0];
  if(!f) return;
  const reader = new FileReader();
  reader.onload = (ev)=>{
    try{
      const parsed = JSON.parse(ev.target.result);
      const v = validateImport(parsed);
      if(!v.ok){
        $(selectors.importError).textContent = v.msg;
        return;
      }
      importRecords(parsed);
      renderAll();
      $(selectors.importError).textContent = '';
      alert('Import successful');
    } catch(err){
      $(selectors.importError).textContent = 'Invalid JSON file.';
    }
  };
  reader.readAsText(f);
}

// stats
function renderStats(){
  const container = $(selectors.stats);
  const total = STATE.records.length;
  const sum = STATE.records.reduce((s,r)=>s + Number(r.duration||0),0);
  const top = topTag();
  container.innerHTML = `
    <div class="row"><strong>Total:</strong> <span style="margin-left:.5rem">${total}</span></div>
    <div class="row"><strong>Minutes sum:</strong> <span style="margin-left:.5rem">${sum}</span></div>
    <div class="row"><strong>Top tag:</strong> <span style="margin-left:.5rem">${top || '—'}</span></div>
  `;
  // cap message update
  updateCapMessage();
}

function topTag(){
  if(STATE.records.length===0) return null;
  const map = {};
  for(const r of STATE.records){
    map[r.tag] = (map[r.tag]||0) + 1;
  }
  return Object.entries(map).sort((a,b)=>b[1]-a[1])[0][0];
}

function renderTrend(){
  const el = document.getElementById('trend');
  el.innerHTML = '';
  // last 7 days trend: count durations per day
  const today = new Date();
  const days = [];
  for(let i=6;i>=0;i--){
    const d = new Date(today);
    d.setDate(today.getDate()-i);
    days.push(d.toISOString().slice(0,10));
  }
  const counts = days.map(day=>{
    return STATE.records.filter(r=>r.date === day).reduce((s,r)=>s + Number(r.duration||0),0);
  });
  const max = Math.max(...counts, 1);
  counts.forEach(c=>{
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${(c/max)*100}%`;
    el.appendChild(bar);
  });
}

function onSaveCap(){
  const v = Number($(selectors.capInput).value || 0);
  STATE.settings.cap = v;
  saveSettings(STATE.settings);
  updateCapMessage();
}

function updateCapMessage(){
  const cap = Number(STATE.settings.cap || 0);
  if(!cap){
    $(selectors.capMessage).textContent = 'No weekly target set.';
    $(selectors.capMessage).setAttribute('aria-live','polite');
    return;
  }
  // compute last 7 days sum
  const today = new Date();
  const days = [];
  for(let i=6;i>=0;i--){
    const d = new Date(today);
    d.setDate(today.getDate()-i);
    days.push(d.toISOString().slice(0,10));
  }
  const sum = STATE.records.filter(r=>days.includes(r.date)).reduce((s,r)=>s + Number(r.duration||0),0);
  const remaining = cap - sum;
  const el = $(selectors.capMessage);
  if(remaining >= 0){
    el.textContent = `Under target. ${remaining} minutes remaining this week.`;
    el.setAttribute('aria-live','polite');
  } else {
    el.textContent = `Target exceeded by ${Math.abs(remaining)} minutes!`;
    el.setAttribute('aria-live','assertive');
  }
}

// settings
function onSaveSettings(){
  const units = $(selectors.units).value;
  const animations = $('#showAnimations') ? $('#showAnimations').value : 'on';
  STATE.settings.units = units;
  STATE.settings.animations = animations;
  saveSettings(STATE.settings);
  renderAll();
  alert('Settings saved.');
}

function onResetSettings(){
  STATE.settings = {units:'minutes', animations:'on', cap:0};
  saveSettings(STATE.settings);
  location.reload();
}

// small helpers
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));
}

function displayDuration(duration){
  const units = STATE.settings.units || 'minutes';
  if(units === 'hours'){
    const hours = (Number(duration)/60).toFixed(2);
    return `${hours} h`;
  } else {
    return `${duration} min`;
  }
}
