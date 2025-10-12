// Title: no leading/trailing spaces, collapse doubles
const titleRe = /^\S(?:.*\S)?$/;
// Date: YYYY-MM-DD
const dateRe = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
// Duration: numeric, 0 or more with decimals
const durationRe = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
// Tag: letters, spaces, hyphens
const tagRe = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
// Advanced: duplicate word detection (back-reference)
const duplicateWordRe = /\b(\w+)\s+\1\b/i;

export function validateRecord(record) {
  const errors = [];
  if (!titleRe.test(record.title)) errors.push('Invalid title format.');
  if (!dateRe.test(record.dueDate)) errors.push('Invalid date.');
  if (!durationRe.test(record.duration)) errors.push('Duration must be numeric.');
  if (!tagRe.test(record.tag)) errors.push('Invalid tag format.');
  if (duplicateWordRe.test(record.title)) errors.push('Title contains duplicate words.');
  return errors;
}

export const patterns = { titleRe, dateRe, durationRe, tagRe, duplicateWordRe };
