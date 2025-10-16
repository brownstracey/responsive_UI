const LS_KEY = 'campusPlannerNotifs';
  let notifs = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  const $ = id => document.getElementById(id);
  const save = () => localStorage.setItem(LS_KEY, JSON.stringify(notifs));

  function render() {
    const container = $('notifContainer');
    if (!notifs.length) {
      container.innerHTML = '<p class="empty">No notifications yet 💭</p>';
      return;
    }
    container.innerHTML = notifs.map(n => `
      <div class="notif-box ${n.read ? 'read' : ''}">
        <strong>${n.title}</strong>
        <small>${n.msg}</small>
        <em>⏰ ${new Date(n.time).toLocaleString()}</em>
        <button onclick="markRead('${n.id}')">${n.read ? 'Unread' : 'Mark Read'}</button>
        <button onclick="deleteNotif('${n.id}')">Delete</button>
      </div>
    `).join('');
  }

  function addOrUpdate(e) {
    e.preventDefault();
    const id = $('notifId').value;
    const n = {
      id: id || Date.now().toString(),
      title: $('notifTitle').value.trim(),
      msg: $('notifMsg').value.trim(),
      time: $('notifTime').value,
      read: false
    };
    if (!n.title || !n.msg || !n.time) return alert('Please fill all fields.');
    if (id) {
      const i = notifs.findIndex(x => x.id === id);
      notifs[i] = n;
    } else {
      notifs.push(n);
    }
    save(); clearForm(); render();
  }

  function deleteNotif(id) {
  if (confirm("Are you sure you want to delete this notification?")) {
    notifs = notifs.filter(n => n.id !== id);
    updateLocalStorage();
    renderUI();
  }
}

function announce(msg) {
  const el = document.getElementById("status");
  el.textContent = msg;
}

  function markRead(id) {
    const n = notifs.find(x => x.id === id);
    if (!n) return;
    n.read = !n.read;
    save(); render();
  }

  function clearForm() {
    $('notifForm').reset();
    $('notifId').value = '';
  }

  $('notifForm').onsubmit = addOrUpdate;
  $('clearBtn').onclick = clearForm;

  render();