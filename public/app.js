const API = "/api/students";

async function showMessage(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("error", isError);
}

const addForm = document.getElementById("addForm");
if (addForm) {
  addForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = document.getElementById("message");
    const data = {
      student_id: document.getElementById("student_id").value,
      student_name: document.getElementById("student_name").value
    };
    try {
      const response = await fetch(API, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to add student");
      addForm.reset();
      showMessage(message, result.message);
    } catch (error) { showMessage(message, error.message, true); }
  });
}

const rows = document.getElementById("studentRows");
let allStudents = [];

function renderStudents(students) {
  if (!rows) return;
  if (!students.length) {
    rows.innerHTML = '<tr><td colspan="3" class="td-empty">No student records found.</td></tr>';
    return;
  }
  rows.innerHTML = students.map(student => `
    <tr>
      <td>${escapeHtml(student.student_id)}</td>
      <td>${escapeHtml(student.student_name)}</td>
      <td><button class="action-btn" data-edit="${escapeHtml(student.student_id)}">Edit</button>
      <button class="action-btn" data-delete="${escapeHtml(student.student_id)}">Delete</button></td>
    </tr>`).join("");
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[ch]));
}
async function loadStudents() {
  if (!rows) return;
  rows.innerHTML = '<tr><td colspan="3" class="td-empty">Loading...</td></tr>';
  try {
    const response = await fetch(API);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load records");
    allStudents = data;
    renderStudents(allStudents);
  } catch (error) {
    rows.innerHTML = `<tr><td colspan="3" class="td-empty">${escapeHtml(error.message)}. Check server and database.</td></tr>`;
  }
}
if (rows) {
  loadStudents();
  document.getElementById("refreshBtn").addEventListener("click", loadStudents);
  document.getElementById("searchInput").addEventListener("input", event => {
    const q = event.target.value.toLowerCase();
    renderStudents(allStudents.filter(s => String(s.student_id).includes(q) || s.student_name.toLowerCase().includes(q)));
  });
  rows.addEventListener("click", async event => {
    const editId = event.target.dataset.edit;
    const deleteId = event.target.dataset.delete;
    if (editId) {
      document.getElementById("update_id").value = editId;
      document.getElementById("update_name").value = allStudents.find(s => String(s.student_id) === editId)?.student_name || "";
      document.getElementById("update_name").focus();
    }
    if (deleteId && confirm(`Delete student ID ${deleteId}?`)) {
      const message = document.getElementById("message");
      try {
        const response = await fetch(`${API}/${deleteId}`, { method: "DELETE" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Delete failed");
        showMessage(message, result.message);
        loadStudents();
      } catch (error) { showMessage(message, error.message, true); }
    }
  });
}

const updateForm = document.getElementById("updateForm");
if (updateForm) {
  updateForm.addEventListener("submit", async event => {
    event.preventDefault();
    const id = document.getElementById("update_id").value;
    const name = document.getElementById("update_name").value;
    const message = document.getElementById("message");
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_name: name })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Update failed");
      showMessage(message, result.message);
      updateForm.reset();
      loadStudents();
    } catch (error) { showMessage(message, error.message, true); }
  });
}
