async function fetchHistory() {
  const res = await fetch('/contact/history');
  return await res.json();
}

function renderTable(history) {
  const tbody = document.getElementById('historyTable');
  tbody.innerHTML = '';
  history.forEach(h => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(h.date).toLocaleString()}</td>
      <td>${h.email}</td>
      <td>${h.subject}</td>
      <td>${h.files.join(', ')}</td>
    `;
    tbody.appendChild(tr);
  });
}

async function init() {
  const allHistory = await fetchHistory();
  renderTable(allHistory);

  const emailInput = document.getElementById('filterEmail');
  const subjectInput = document.getElementById('filterSubject');

  function filter() {
    const filtered = allHistory.filter(h => 
      h.email.toLowerCase().includes(emailInput.value.toLowerCase()) &&
      h.subject.toLowerCase().includes(subjectInput.value.toLowerCase())
    );
    renderTable(filtered);
  }

  emailInput.addEventListener('input', filter);
  subjectInput.addEventListener('input', filter);
}

init();
