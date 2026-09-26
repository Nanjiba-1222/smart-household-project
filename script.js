// Global State Initializer
document.addEventListener("DOMContentLoaded", () => {
  updateDashboard();
  renderExpenseHistory();
  renderTrackerList();
});

// Sidebar Navigation Switcher
function switchTab(tabName) {
  const sections = ['dashboard', 'set-budget', 'add-expense', 'expense-history', 'price-tracker'];
  
  sections.forEach(sec => {
    document.getElementById(`section-${sec}`).style.display = (sec === tabName) ? 'block' : 'none';
    document.getElementById(`nav-${sec}`).classList.toggle('active', sec === tabName);
  });
}

// Set Budget Handler
function handleSetBudget(event) {
  event.preventDefault();
  const budget = parseFloat(document.getElementById('monthlyBudget').value);
  localStorage.setItem('monthlyBudget', budget);
  alert("Monthly budget set successfully!");
  document.getElementById('monthlyBudget').value = '';
  updateDashboard();
  switchTab('dashboard');
}

// Add Expense Handler
function handleAddExpense(event) {
  event.preventDefault();
  const category = document.getElementById('expCategory').value;
  const amount = parseFloat(document.getElementById('expAmount').value);
  const date = document.getElementById('expDate').value;
  const note = document.getElementById('expNote').value || '-';

  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  expenses.push({ category, amount, date, note });
  localStorage.setItem('expenses', JSON.stringify(expenses));

  alert("Expense added successfully!");
  document.getElementById('expAmount').value = '';
  document.getElementById('expNote').value = '';
  
  updateDashboard();
  renderExpenseHistory();
  switchTab('expense-history');
}

// Add/Update Product Price Handler
function handleAddPrice(event) {
  event.preventDefault();
  const product = document.getElementById('product').value.trim();
  const unit = document.getElementById('unit').value.trim();
  const market = document.getElementById('market').value.trim();
  const currentPrice = parseFloat(document.getElementById('currentPrice').value);

  let priceTracker = JSON.parse(localStorage.getItem('priceTracker')) || [];

  const existingIndex = priceTracker.findIndex(item => 
    item.product.toLowerCase().includes(product.toLowerCase()) && 
    item.market.toLowerCase() === market.toLowerCase()
  );

  if (existingIndex !== -1) {
    priceTracker[existingIndex].previous = priceTracker[existingIndex].current;
    priceTracker[existingIndex].current = currentPrice;
  } else {
    priceTracker.push({
      product: `${product} (${unit})`,
      market: market,
      previous: currentPrice,
      current: currentPrice
    });
  }

  localStorage.setItem('priceTracker', JSON.stringify(priceTracker));
  alert(`Price updated for ${product}!`);
  document.getElementById('priceForm').reset();
  renderTrackerList();
}

// Dashboard Calculation Update
function updateDashboard() {
  const budget = parseFloat(localStorage.getItem('monthlyBudget')) || 0;
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = budget - totalSpent;

  document.getElementById('dash-budget').innerText = `৳ ${budget.toFixed(2)}`;
  document.getElementById('dash-spent').innerText = `৳ ${totalSpent.toFixed(2)}`;
  document.getElementById('dash-balance').innerText = `৳ ${remaining.toFixed(2)}`;
}

// Render Expense History Table
function renderExpenseHistory() {
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const tbody = document.getElementById('expense-table-body');
  tbody.innerHTML = '';

  expenses.forEach(exp => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${exp.date}</td>
      <td>${exp.category}</td>
      <td>${exp.note}</td>
      <td>৳ ${exp.amount.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Render Price Tracker Table
function renderTrackerList() {
  const priceTracker = JSON.parse(localStorage.getItem('priceTracker')) || [];
  const tbody = document.getElementById('tracker-table-body');
  tbody.innerHTML = '';

  priceTracker.forEach(item => {
    const diff = item.current - item.previous;
    let changeText = '-';
    let changeClass = '';

    if (diff > 0) {
      changeText = `▲ ${diff.toFixed(2)}`;
      changeClass = 'price-up';
    } else if (diff < 0) {
      changeText = `▼ ${Math.abs(diff).toFixed(2)}`;
      changeClass = 'price-down';
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.product}</td>
      <td>${item.market}</td>
      <td>৳ ${item.previous.toFixed(2)}</td>
      <td>৳ ${item.current.toFixed(2)}</td>
      <td class="${changeClass}">${changeText}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Logout Handler
function logout() {
  if (confirm("Are you sure you want to log out?")) {
    alert("Logged out successfully!");
  }
}