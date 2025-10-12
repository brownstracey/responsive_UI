// storage.js - simple localStorage wrapper + import/export validation
export const KEY = 'campus:records:v1';
export const KEY_SETTINGS = 'campus:settings:v1';

export function loadRecords(){
  try{
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch(e){
    console.error('loadRecords parse failed', e);
    return null;
  }
}

export function saveRecords(records){
  localStorage.setItem(KEY, JSON.stringify(records));
}

export function loadSettings(){
  try{
    const raw = localStorage.getItem(KEY_SETTINGS);
    return raw ? JSON.parse(raw) : {units:'minutes', animations:'on', cap:0};
  } catch {
    return {units:'minutes', animations:'on', cap:0};
  }
}

export function saveSettings(settings){
  localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
}

export function validateImport(data){
  if(!Array.isArray(data)) return {ok:false, msg:'Imported JSON must be an array of records.'};
  for(const r of data){
    if(typeof r.id !== 'string') return {ok:false, msg:'Record missing id string.'};
    if(typeof r.title !== 'string') return {ok:false, msg:'Record missing title string.'};
    if(typeof r.duration !== 'number') return {ok:false, msg:'duration must be number.'};
    if(typeof r.tag !== 'string') return {ok:false, msg:'tag must be string.'};
    if(typeof r.date !== 'string') return {ok:false, msg:'date must be string YYYY-MM-DD.'};
    // more checks could be added
  }
  return {ok:true};
}
