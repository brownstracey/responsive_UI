  const LS_SETTINGS = 'campusPlannerSettings';
  const LS_RECORDS = 'recordsData'; // same key as used in records page

  const defaults = {
    theme: 'light',
    defaultTag: '',
    defaultDuration: 45
  };

  const $ = id => document.getElementById(id);

  function loadSettings() {
    const s = JSON.parse(localStorage.getItem(LS_SETTINGS) || 'null') || defaults;
    $('theme').value = s.theme || defaults.theme;
    $('defaultTag').value = s.defaultTag || '';
    $('defaultDuration').value = s.defaultDuration || '';
    applyTheme(s.theme);
  }

  function saveSettings(e) {
    e.preventDefault();
    const settings = {
      theme: $('theme').value,
      defaultTag: $('defaultTag').value,
      defaultDuration: Number($('defaultDuration').value) || defaults.defaultDuration
    };
    localStorage.setItem(LS_SETTINGS, JSON.stringify(settings));
    applyTheme(settings.theme);
    alert('Settings saved!');
  }

  function resetSettings() {
    localStorage.removeItem(LS_SETTINGS);
    loadSettings();
    alert('Settings reset to defaults');
  }

  function clearAllRecords() {
    if (confirm('Delete all saved records? This cannot be undone.')) {
      localStorage.removeItem(LS_RECORDS);
      alert('All records cleared.');
    }
  }

  function applyTheme(theme) {
    document.body.className = theme === 'dark' ? 'dark' : '';
  }

  $('settingsForm').onsubmit = saveSettings;
  $('resetBtn').onclick = resetSettings;
  $('clearRecordsBtn').onclick = clearAllRecords;

  loadSettings();