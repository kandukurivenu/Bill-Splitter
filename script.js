// DOM Elements
const billTotalInput = document.getElementById('bill-total');
const peopleCountInput = document.getElementById('people-count');
const tipPercentageSlider = document.getElementById('tip-percentage');
const tipValueDisplay = document.getElementById('tip-value');
const customTipInput = document.getElementById('custom-tip');
const taxRateInput = document.getElementById('tax-rate');
const totalPerPersonDisplay = document.getElementById('total-per-person');
const currencySelector = document.getElementById('currency');
const currencySymbolDisplay = document.getElementById('currency-symbol');
const historyTableBody = document.querySelector('#history-table tbody');
const exportPdfButton = document.getElementById('export-pdf');
const themeSwitch = document.getElementById('theme-switch');

// Event Listeners
billTotalInput.addEventListener('input', calculateTotal);
peopleCountInput.addEventListener('input', calculateTotal);
tipPercentageSlider.addEventListener('input', updateTipValue);
customTipInput.addEventListener('input', updateCustomTip);
taxRateInput.addEventListener('input', calculateTotal);
currencySelector.addEventListener('change', updateCurrency);
themeSwitch.addEventListener('change', toggleTheme);
exportPdfButton.addEventListener('click', exportToPDF);

let calculationHistory = [];

// Functions
function calculateTotal() {
  const billTotal = parseFloat(billTotalInput.value) || 0;
  const peopleCount = parseInt(peopleCountInput.value) || 1;
  const tipPercentage = customTipInput.value ? parseFloat(customTipInput.value) : parseInt(tipPercentageSlider.value);
  const taxRate = parseFloat(taxRateInput.value) || 0;

  if (peopleCount <= 0) {
    alert('Number of people must be greater than 0.');
    return;
  }

  const taxAmount = (billTotal * taxRate) / 100;
  const tipAmount = ((billTotal + taxAmount) * tipPercentage) / 100;
  const totalWithTaxAndTip = billTotal + taxAmount + tipAmount;
  const totalPerPerson = totalWithTaxAndTip / peopleCount;

  totalPerPersonDisplay.textContent = totalPerPerson.toFixed(2);

  // Save to history
  saveToHistory(billTotal, totalPerPerson);
}

function updateTipValue() {
  const tipPercentage = tipPercentageSlider.value;
  tipValueDisplay.textContent = `${tipPercentage}%`;
  customTipInput.value = ''; // Clear custom tip when slider is used
  calculateTotal();
}

function updateCustomTip() {
  const customTip = customTipInput.value;
  if (customTip) {
    tipPercentageSlider.value = customTip; // Sync slider with custom tip
    tipValueDisplay.textContent = `${customTip}%`;
    calculateTotal();
  }
}

function updateCurrency() {
  currencySymbolDisplay.textContent = currencySelector.value;
}

function saveToHistory(total, perPerson) {
  const date = new Date().toLocaleString();
  calculationHistory.push({ date, total: total.toFixed(2), perPerson: perPerson.toFixed(2) });

  renderHistory();
}

function renderHistory() {
  historyTableBody.innerHTML = '';
  calculationHistory.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${currencySelector.value}${entry.total}</td>
      <td>${currencySelector.value}${entry.perPerson}</td>
    `;
    historyTableBody.appendChild(row);
  });
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}

function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text('Bill Splitter History', 10, 10);
  doc.autoTable({
    startY: 20,
    head: [['Date', 'Total', 'Per Person']],
    body: calculationHistory.map(entry => [
      entry.date,
      `${currencySelector.value}${entry.total}`,
      `${currencySelector.value}${entry.perPerson}`
    ])
  });

  doc.save('bill-splitter-history.pdf');
}

// Initial Call
updateTipValue();
updateCurrency();