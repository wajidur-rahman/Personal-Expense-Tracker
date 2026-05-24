const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const type = document.getElementById('type');
const clearBtn = document.getElementById('clear-btn');

// নতুন টগল উপাদানসমূহ
const toggleHistoryBtn = document.getElementById('toggle-history-btn');
const historySection = document.getElementById('history-section');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function addTransaction(e) {
  e.preventDefault();

  let transactionAmount = +amount.value;
  if (type.value === 'expense') {
    transactionAmount = -transactionAmount;
  }

  const now = new Date();
  const options = { month: 'short', day: 'numeric' };
  const datePart = now.toLocaleDateString('en-US', options);
  const timePart = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const formattedDate = `${datePart}, ${timePart}`;

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: transactionAmount,
    date: formattedDate
  };

  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();

  text.value = '';
  amount.value = '';
  type.value = 'income';
}

function generateID() {
  return Math.floor(Math.random() * 100000000);
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  
  item.innerHTML = `
    <div class="item-info">
        <strong>${transaction.text}</strong>
        <span class="item-date">${transaction.date || 'N/A'}</span>
    </div>
    <span>${sign}৳${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

  balance.innerText = `৳${total}`;
  money_plus.innerText = `+৳${income}`;
  money_minus.innerText = `-৳${expense}`;
  
  // বাটনের ভেতরের সংখ্যা আপডেট করা (যেমন: View History (5))
  toggleHistoryBtn.innerText = historySection.classList.contains('hide') 
    ? `View History (${transactions.length})` 
    : `Hide History`;
}

function removeTransaction(id) {
  if (confirm("Are you sure you want to delete this transaction?")) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
  }
}

function clearAllTransactions() {
  if (transactions.length === 0) {
    alert("History is already empty!");
    return;
  }
  
  if (confirm("Warning! This will delete ALL your transaction history. Proceed?")) {
    transactions = [];
    updateLocalStorage();
    init();
    // ডিলিট করার পর হিস্ট্রি হাইড করে দেওয়া
    historySection.classList.add('hide');
  }
}

// হিস্ট্রি দেখানো বা লুকানোর ফাংশন (Toggle)
function toggleHistory() {
  historySection.classList.toggle('hide');
  
  if (historySection.classList.contains('hide')) {
    toggleHistoryBtn.innerText = `View History (${transactions.length})`;
  } else {
    toggleHistoryBtn.innerText = `Hide History`;
  }
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);
clearBtn.addEventListener('click', clearAllTransactions);
toggleHistoryBtn.addEventListener('click', toggleHistory); // টগল বাটনে ক্লিক ইভেন্ট