const vm = new VendingMachine();

const productsEl   = document.getElementById('products');
const paymentEl    = document.getElementById('payment');
const selectionEl  = document.getElementById('selection');
const priceEl      = document.getElementById('price');
const balanceEl    = document.getElementById('balance');
const dueEl        = document.getElementById('due');
const changeEl     = document.getElementById('change');
const billChoiceEl = document.getElementById('billChoice');
const insertBtn    = document.getElementById('insertBtn');
const msgEl        = document.getElementById('message');

function renderProducts() {
  productsEl.innerHTML = '';
  vm.products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `<strong>${p.name}</strong><br>₹${p.price}`;
    card.onclick = () => select(p.id);
    productsEl.appendChild(card);
  });
}

function select(id) {
  const res = vm.selectProduct(id);
  if (!res.ok) return flash(res.message);
  const p = vm.selectedProduct;
  selectionEl.textContent = p.name;
  priceEl.textContent     = p.price;
  balanceEl.textContent   = 0;
  dueEl.textContent       = '';
  changeEl.textContent    = '';
  paymentEl.hidden        = false;
  msgEl.textContent       = '';
}

insertBtn.onclick = () => {
  const bill = Number(billChoiceEl.value);
  const res  = vm.insertBills(bill);
  balanceEl.textContent = vm.balance;
  if (!res.ok) {
    dueEl.textContent = res.message;
    changeEl.textContent = '';
  } else {
    dueEl.textContent    = '';
    changeEl.textContent = res.message;
    paymentEl.hidden     = true;
    renderProducts();          // remove sold item
  }
};

function flash(txt) {
  msgEl.textContent = txt;
  setTimeout(() => msgEl.textContent = '', 2500);
}

renderProducts();