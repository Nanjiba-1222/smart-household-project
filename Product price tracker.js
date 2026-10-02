// CLEAN TEXT
function normalizeText(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}
// HANDLE PRICE FORM SUBMISSION
function handleAddPrice(event) {
  event.preventDefault();
  const product = normalizeText(
  document.getElementById('product').value
  );
  const unit = normalizeText(
    document.getElementById('unit').value
  );
  const market = normalizeText(
    document.getElementById('market').value
  );
  const currentPrice = parseFloat(
    document.getElementById('currentPrice').value
  );
  // Validation
  if (
    !product ||
    !unit ||
    !market ||
    isNaN(currentPrice) ||
    currentPrice <= 0
  ) {
    alert('Please enter valid product information.');
    return;
  }
  const existingIndex = priceTracker.findIndex(
    item =>
      normalizeText(item.product) === product &&
      normalizeText(item.unit) === unit
  );
  // EXISTING PRODUCT
  if (existingIndex !== -1) {
    const existingItem = priceTracker[existingIndex];
    // Old current price becomes previous price
    existingItem.previousPrice =
      Number(existingItem.currentPrice);
    // New price becomes current price
    existingItem.currentPrice =
      currentPrice;
    // Latest market name update
    existingItem.market =
      market;
    existingItem.updatedAt =
      new Date().toISOString();
    priceTracker[existingIndex] =
      existingItem;
  }
  // NEW PRODUCT
  else {
    priceTracker.push({
      id: Date.now(),
      product: product,
      unit: unit,
      market: market,
      // First time = no previous price
      previousPrice: null,
      currentPrice: currentPrice,
      createdAt:
        new Date().toISOString()
    });
  }
  // Save to LocalStorage
  localStorage.setItem(
    'hb_priceTracker',
    JSON.stringify(priceTracker)
  );
  // Refresh table
  renderPriceTracker();
  // Reset form
  document
    .getElementById('priceForm')
    .reset();
  alert('Product price record saved!');
}
// RENDER PRICE TRACKER
function renderPriceTracker() {
  const tbody =
    document.getElementById(
      'tracker-table-body'
    );
  if (!tbody) return;

  tbody.innerHTML = '';
  // No data
  if (priceTracker.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td
     colspan="5"
     style="
     text-align:center;
     color:#6b7280;
    padding:25px;
   "
  >
   No price records added yet.
   </td>
   </tr>
    `;
    return;
  }
  priceTracker.forEach(item => {
    const currentPrice =
      Number(item.currentPrice);
    let previousPrice =
      item.previousPrice;
    // PREVIOUS PRICE
    let previousText = '—';
    if (
      previousPrice !== null &&
      previousPrice !== undefined &&
      previousPrice !== ''
    ) {
      previousPrice =
        Number(previousPrice);
      previousText =
        `৳ ${previousPrice.toFixed(2)}`;
    }
    // CHANGE
    let changeText = '—';
    let changeClass = '';
    if (previousPrice !== null) {
     const diff =
     currentPrice -
     previousPrice;
      // PRICE INCREASED
      if (diff > 0) {
       changeText =
       `+৳ ${diff.toFixed(2)} (Up)`;
        changeClass =
       'price-up';
      }
      // PRICE DECREASED
      else if (diff < 0) {
        changeText =
      `-৳ ${Math.abs(diff).toFixed(2)} (Down)`;
        changeClass =
       'price-down';
      }
      // SAME PRICE
      else {
        changeText =
          'No Change';
      }
    }
    // CREATE ROW
    const row =
      document.createElement('tr');
    row.innerHTML = `
    <td style="text-transform: capitalize;">
    <strong>
      ${item.product}
       </strong>
       <br>
       <small>
       ${item.unit}
       </small>
      </td>
      <td style="text-transform: capitalize;">
     ${item.market}
      </td>
      <td>
       ${previousText}
      </td>
      <td>
        ৳ ${currentPrice.toFixed(2)}
      </td>
      <td class="${changeClass}">
        ${changeText}
      </td>
    `;
    tbody.appendChild(row);
  });
}
// LOAD SAVED PRICE DATA
document.addEventListener(
  'DOMContentLoaded',
  function () {
    const savedPriceTracker =
     localStorage.getItem(
    'hb_priceTracker'
      );
    if (savedPriceTracker) {
      priceTracker =
       JSON.parse(
      savedPriceTracker
        );
    }
    renderPriceTracker();
  }
);let priceTracker = [];
