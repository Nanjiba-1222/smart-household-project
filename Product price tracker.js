let priceTracker = [];
// Handle price tracker form submission
function handleAddPrice(event) {
  event.preventDefault();
  const product = document.getElementById('product').value.trim().toLowerCase();
  const unit = document.getElementById('unit').value.trim().toLowerCase();
  const market = document.getElementById('market').value.trim().toLowerCase();
  const currentPrice = parseFloat(document.getElementById('currentPrice').value) || 0;
  const existingIndex = priceTracker.findIndex(
    item => item.product === product && item.unit === unit && item.market === market
  );
  if (existingIndex > -1) {
    const existingItem = priceTracker[existingIndex];
    existingItem.previousPrice = existingItem.currentPrice;
    existingItem.currentPrice = currentPrice;
  } else {
    priceTracker.push({
      id: Date.now(),
      product,
      unit,
      market,
      previousPrice: currentPrice,
      currentPrice
    });
  }
  // Save to LocalStorage
  localStorage.setItem('hb_priceTracker', JSON.stringify(priceTracker));
  renderPriceTracker();
  document.getElementById('priceForm').reset();
  alert('Product price record saved!');
}
// Render Price Tracker table with Up/Down change indicator
function renderPriceTracker() {
  const tbody = document.getElementById('tracker-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (priceTracker.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #6b7280;">No price records added yet.</td></tr>`;
    return;
  }
  priceTracker.forEach(item => {
    const diff = item.currentPrice - item.previousPrice;
    let changeText = 'No Change';
    let changeClass = '';
    if (diff > 0) {
      changeText = `+৳ ${diff.toFixed(2)} (Up)`;
      changeClass = 'price-up';
    } else if (diff < 0) {
      changeText = `-৳ ${Math.abs(diff).toFixed(2)} (Down)`;
      changeClass = 'price-down';
    }
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="text-transform: capitalize;">${item.product} (${item.unit})</td>
      <td style="text-transform: capitalize;">${item.market}</td>
      <td>৳ ${item.previousPrice.toFixed(2)}</td>
      <td>৳ ${item.currentPrice.toFixed(2)}</td>
      <td class="${changeClass}">${changeText}</td>
    `;
    tbody.appendChild(row);
  });
}
// Load saved data when page loads
document.addEventListener('DOMContentLoaded', () => {
  const savedBudget = localStorage.getItem('hb_budget');
  const savedExpenses = localStorage.getItem('hb_expenses');
  const savedPriceTracker = localStorage.getItem('hb_priceTracker');
  if (savedBudget) budget = JSON.parse(savedBudget);
  if (savedExpenses) expenses = JSON.parse(savedExpenses);
  if (savedPriceTracker) priceTracker = JSON.parse(savedPriceTracker);
  renderDashboard();
  renderExpenses();
  renderPriceTracker();
});