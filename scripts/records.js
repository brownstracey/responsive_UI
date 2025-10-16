const LS_KEY = 'recordsData';
  const tagRegex = /^@tag:(\w+)/i;
  const timeRegex = /\b\d{2}:\d{2}\b/g;
  let records = JSON.parse(localStorage.getItem(LS_KEY) || '[]');

  const $ = id => document.getElementById(id);
  const saveData = () => localStorage.setItem(LS_KEY, JSON.stringify(records));

  function render(filter = '') {
    let list = [...records];
    const tagMatch = filter.match(tagRegex);
    if (tagMatch) list = list.filter(r => r.tag.toLowerCase() === tagMatch[1].toLowerCase());
    else if (filter) list = list.filter(r => (r.title + r.tag).toLowerCase().includes(filter.toLowerCase()));

    $('recordsContainer').innerHTML = list.map(r => {
      const times = (r.title.match(timeRegex) || []).join(', ');
      return `
        <div class="record-box">
          <b>${r.title}</b> <span>[${r.tag || 'no tag'}]</span><br>
          <small>Due: ${r.dueDate || '-'} | Duration: ${r.duration || '-'}</small><br>
          ${times ? `<em>Times: ${times}</em>` : ''}
          <div class="buttons">
            <button onclick="editRecord('${r.id}')">Edit</button>
            <button onclick="deleteRecord('${r.id}')">Delete</button>
          </div>
        </div>
      `;
    }).join('') || '<p>No records</p>';
  }

  function addOrUpdate(e) {
    e.preventDefault();
    const id = $('recordId').value;
    const data = {
      id: id || Date.now().toString(),
      title: $('title').value,
      dueDate: $('dueDate').value,
      duration: $('duration').value,
      tag: $('tag').value
    };
    if (id) {
      const i = records.findIndex(r => r.id === id);
      records[i] = data;
    } else {
      records.push(data);
    }
    saveData(); clearForm(); render();
  }

  function editRecord(id) {
    const r = records.find(x => x.id === id);
    if (!r) return;
    $('recordId').value = r.id;
    $('title').value = r.title;
    $('dueDate').value = r.dueDate;
    $('duration').value = r.duration;
    $('tag').value = r.tag;
  }

  function deleteRecord(id) {
    if (confirm('Delete this record?')) {
      records = records.filter(x => x.id !== id);
      saveData(); render();
    }
  }

  function clearForm() {
    $('recordForm').reset();
    $('recordId').value = '';
  }

  $('recordForm').onsubmit = addOrUpdate;
  $('clearBtn').onclick = clearForm;
  $('searchBtn').onclick = () => render($('searchBox').value);
  $('searchBox').onkeyup = (e) => { if (e.key === 'Enter') render(e.target.value); };

  $('seedBtn').onclick = () => {
    records.push(
      {id:'1', title:'Math Homework 09:00', dueDate:'2025-10-20', duration:'45', tag:'hw'},
      {id:'2', title:'Project Meeting 17:30', dueDate:'2025-10-22', duration:'02:00', tag:'project'}
    );
    saveData(); render();
  };

  render();