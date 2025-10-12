import { load, save } from './storage.js';

let data = load();

export const getAll = () => data;

export const add = (record) => {
  const id = `task_${Date.now()}`;
  const now = new Date().toISOString();
  const newRec = { ...record, id, createdAt: now, updatedAt: now };
  data.push(newRec);
  save(data);
  return newRec;
};

export const update = (id, updates) => {
  const rec = data.find(r => r.id === id);
  if (!rec) return;
  Object.assign(rec, updates, { updatedAt: new Date().toISOString() });
  save(data);
};

export const remove = (id) => {
  data = data.filter(r => r.id !== id);
  save(data);
};

export const setAll = (newData) => {
  data = newData;
  save(data);
};
