(() => {
  const LS = 'lovely_todo_v1';
  const tagFilterRe = /^@tag:(\w+)$/i;
  const timeTokenRe = /\b\d{2}:\d{2}\b/g;

  const $ = id => document.getElementById(id);

  let tasks = JSON.parse(localStorage.getItem(LS) || '[]');

  // helpers
  const uid = () => 't' + Math.random().toString(36).slice(2,9);
  const save = () => localStorage.setItem(LS, JSON.stringify(tasks));
  const todayISO = () => new Date().toISOString().slice(0,10);

  // render
  function render(filter = '', sortMode = 'default') {
    const listEl = $('list');
    let out = [...tasks];

    // FILTER
    const tagMatch = filter.trim().match(tagFilterRe);
    if (tagMatch) {
      const t = tagMatch[1].toLowerCase();
      out = out.filter(x => (x.tag||'').toLowerCase() === t);
    } else if (filter.trim()) {
      const q = filter.trim().toLowerCase();
      out = out.filter(x => (x.title + ' ' + (x.notes||'') + ' ' + (x.tag||'')).toLowerCase().includes(q));
    }

    // SORT
    if (sortMode === 'dueAsc') out.sort((a,b) => (a.due||'').localeCompare(b.due||'') || (a.priority||'').localeCompare(b.priority||''));
    else if (sortMode === 'dueDesc') out.sort((a,b) => (b.due||'').localeCompare(a.due||''));
    else if (sortMode === 'priority') {
      const score = p => p === 'high' ? 0 : p === 'med' ? 1 : 2;
      out.sort((a,b) => (score(a.priority) - score(b.priority)) || (a.due||'').localeCompare(b.due||''));
    }

    if (!out.length) {
      listEl.innerHTML = '<div class="empty">No tasks — add something lovely ✨</div>';
      return;
    }

    listEl.innerHTML = out.map(t => {
      const times = ((t.title||'').match(timeTokenRe) || []).concat(((t.notes||'').match(timeTokenRe) || [])).filter(Boolean);
      const tagHtml = t.tag ? `<div class="tag">${escapeHtml(t.tag)}</div>` : '';
      const priorityClass = t.priority === 'high' ? 'high' : (t.priority === 'med' ? 'med' : 'low');
      const completedClass = t.done ? 'completed' : '';
      return `
        <div class="task ${completedClass}" data-id="${t.id}">
          <div class="checkbox" data-action="toggle">${t.done ? '✓' : '+'}</div>
          <div class="body">
            <div class="title">${escapeHtml(t.title)}</div>
            <div class="meta">
              <div class="pill">${t.due ? 'Due: ' + escapeHtml(t.due) : 'No due date'}</div>
              <div class="pill">${t.notes ? escapeHtml(t.notes).slice(0,40) : ''}</div>
              ${tagHtml}
              <div class="priority ${priorityClass}">${t.priority || 'med'}</div>
            </div>
            ${times.length ? `<div style="margin-top:6px;color:var(--accent);font-weight:700">Times: ${times.join(', ')}</div>` : ''}
          </div>
          <div class="actions">
            <button data-action="edit" title="Edit">✎</button>
            <button data-action="delete" title="Delete">🗑</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // escape
  function escapeHtml(s){ return String(s||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;'); }

  // CRUD
  function addTask(data) {
    const t = {
      id: uid(),
      title: data.title || '',
      notes: data.notes || '',
      due: data.due || '',
      priority: data.priority || 'med',
      tag: data.tag || '',
      done: false,
      created: new Date().toISOString()
    };
    tasks.unshift(t);
    save();
    render($('search').value, $('sort').value);
  }

  function updateTask(id, data) {
    const i = tasks.findIndex(x => x.id === id);
    if (i === -1) return;
    tasks[i] = {...tasks[i], ...data};
    save();
    render($('search').value, $('sort').value);
  }

  function removeTask(id) {
    tasks = tasks.filter(x => x.id !== id);
    save();
    render($('search').value, $('sort').value);
  }

  function toggleDone(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    t.done = !t.done;
    save();
    render($('search').value, $('sort').value);
  }

  // UI wiring
  $('taskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = $('taskId').value;
    const payload = {
      title: $('title').value.trim(),
      notes: $('notes').value.trim(),
      due: $('due').value || '',
      priority: $('priority').value,
      tag: $('tag').value.trim()
    };
    if (!payload.title) { alert('Please add a title'); return; }
    if (id) {
      updateTask(id, payload);
      $('taskId').value = '';
    } else {
      addTask(payload);
    }
    $('taskForm').reset();
  });

  $('clearBtn').addEventListener('click', () => {
    $('taskForm').reset();
    $('taskId').value = '';
  });

  $('seedBtn').addEventListener('click', () => {
    const samples = [
      { title: 'Math homework 09:00', notes: 'Chapter 5 problems', due: todayISO(), priority: 'med', tag: 'hw' },
      { title: 'Call Mum', notes: 'Her birthday', due: '', priority: 'low', tag: 'personal' },
      { title: 'Group meeting 17:30', notes: 'Project presentation', due: todayISO(), priority: 'high', tag: 'project' }
    ];
    for (const s of samples) {
      tasks.unshift({...s, id: uid(), done:false, created: new Date().toISOString()});
    }
    save();
    render($('search').value, $('sort').value);
  });

  // click delegation for list actions
  document.getElementById('list').addEventListener('click', (ev) => {
    const taskEl = ev.target.closest('.task');
    if (!taskEl) return;
    const id = taskEl.getAttribute('data-id');
    const action = ev.target.getAttribute('data-action');
    if (action === 'toggle') {
      toggleDone(id);
    } else if (action === 'edit') {
      const t = tasks.find(x => x.id === id);
      if (!t) return;
      $('taskId').value = t.id;
      $('title').value = t.title;
      $('notes').value = t.notes;
      $('due').value = t.due;
      $('priority').value = t.priority;
      $('tag').value = t.tag;
      window.scrollTo({top:0,behavior:'smooth'});
    } else if (action === 'delete') {
      if (confirm('Delete this task?')) removeTask(id);
    }
  });

  // Search & sort
  $('searchBtn').addEventListener('click', () => render($('search').value, $('sort').value));
  $('search').addEventListener('keyup', (e) => { if (e.key === 'Enter') render($('search').value, $('sort').value); });
  $('sort').addEventListener('change', () => render($('search').value, $('sort').value));

  // clear completed
  $('clearCompleted').addEventListener('click', () => {
    if (!tasks.some(t => t.done)) { alert('No completed tasks'); return; }
    if (!confirm('Remove all completed tasks?')) return;
    tasks = tasks.filter(t => !t.done);
    save(); render($('search').value, $('sort').value);
  });

  // initial bootstrap
  if (!tasks || tasks.length === 0) {
    // gentle first-run sample
    tasks = [
      { id: uid(), title: 'Welcome! Add a task ✨', notes: 'Try adding times like 08:30 and tags like @tag:hw', due: '', priority: 'med', tag: 'welcome', done: false, created: new Date().toISOString() }
    ];
    save();
  }

  render('', 'default');

  // Expose simple API for debugging in console
  window.lovelyTodo = {
    all: () => tasks,
    clearAll: () => { tasks = []; save(); render(); }
  };
})();