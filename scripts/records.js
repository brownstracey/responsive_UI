const LS_KEY = "recordsData";
let records = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
const $ = id => document.getElementById(id);

function save() {
  localStorage.setItem(LS_KEY, JSON.stringify(records));
}

function render(filter = "") {
  let list = [...records];
  const tag = filter.match(/^@tag:(\w+)/i);
  if (tag) list = list.filter(r => r.tag.toLowerCase() === tag[1].toLowerCase());
  else if (filter) list = list.filter(r => (r.title + r.tag).toLowerCase().includes(filter.toLowerCase()));

  $("Container").innerHTML = list.length
    ? list.map(r => `
      <div class="record-box">
        <b>${r.title}</b> [${r.tag || "no tag"}]<br>
        <small>Due: ${r.dueDate || "-"} | Duration: ${r.duration || "-"}</small><br>
        <button onclick="edit('${r.id}')">Edit</button>
        <button onclick="del('${r.id}')">🗑️</button>
      </div>
    `).join("")
    : "<p>No records</p>";
}

function add(e) {
  e.preventDefault();
  const id = $("recordId").value || Date.now().toString();
  const data = {
    id,
    title: $("title").value.trim(),
    dueDate: $("dueDate").value,
    duration: $("duration").value.trim(),
    tag: $("tag").value.trim()
  };
  if (!data.title) return alert("Title required!");
  const i = records.findIndex(r => r.id === id);
  i >= 0 ? records[i] = data : records.push(data);
  save(); clear(); render();
}

function edit(id) {
  const r = records.find(x => x.id === id);
  if (!r) return;
  $("recordId").value = r.id;
  $("title").value = r.title;
  $("dueDate").value = r.dueDate;
  $("duration").value = r.duration;
  $("tag").value = r.tag;
}

function del(id) {
  if (!confirm("Delete this record?")) return;
  records = records.filter(r => r.id !== id);
  save(); render();
}

function clear() {
  $("recordForm").reset();
  $("recordId").value = "";
}

$("recordForm").onsubmit = add;
$("clearBtn").onclick = clear;
$("searchBtn").onclick = () => render($("searchBox").value);
$("searchBox").onkeyup = e => e.key === "Enter" && render(e.target.value);
$("seedBtn").onclick = () => {
  records.push(
    {id:"1", title:"Frontend formative quiz", dueDate:"2025-10-20", duration:"45", tag:"quiz"},
    {id:"2", title:"Project Meeting", dueDate:"2025-10-22", duration:"02:00", tag:"project"}
  );
  save(); render();
};

render();
