let expenses = [];
// Handle adding new expense
function handleAddExpense(event) {
  event.preventDefault(); 
  const category = document.getElementById('expCategory').value;
  const amount = parseFloat(document.getElementById('expAmount').value) || 0;
  const date = document.getElementById('expDate').value;
  const note = document.getElementById('expNote').value || '-';
  expenses.push({ id: Date.now(), category, amount, date, note });
  // Save to LocalStorage
  localStorage.setItem('hb_expenses', JSON.stringify(expenses));
  renderDashboard();
  renderExpenses();
  // Form Reset
  document.getElementById('expAmount').value = '';
  document.getElementById('expNote').value = '';
  alert('Expense added successfully!');
  switchTab('expense-history');
}
// Render expense history table
function renderExpenses() {
  const tbody = document.getElementById('expense-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (expenses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #6b7280;">No expenses recorded yet.</td></tr>`;
    return;
  }
  expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(exp => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${exp.date}</td>
      <td>${exp.category}</td>
      <td>${exp.note}</td>
      <td>৳ ${exp.amount.toFixed(2)}</td>
    `;
    tbody.appendChild(row);
  });
}
// Render Dashboard totals
function renderDashboard() {
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const balance = budget - totalSpent;
  const bElem = document.getElementById('dash-budget');
  const sElem = document.getElementById('dash-spent');
  const balElem = document.getElementById('dash-balance');
  if (bElem) bElem.textContent = `৳ ${budget.toFixed(2)}`;
  if (sElem) sElem.textContent = `৳ ${totalSpent.toFixed(2)}`;
  if (balElem) balElem.textContent = `৳ ${balance.toFixed(2)}`;
}