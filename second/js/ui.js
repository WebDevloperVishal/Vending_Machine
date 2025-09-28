/* global VendingCore, CATALOG */
const core = new VendingCore();
let selectedSlot = null;

const gridEl        = document.getElementById('grid');
const checkoutEl    = document.getElementById('checkout');
const insertedEl    = document.getElementById('inserted');
const dueOrChangeEl = document.getElementById('dueOrChange');
const dropZoneEl    = document.getElementById('dropZone');

function toast(txt) {
  const t = document.getElementById('toast');
  t.textContent = txt;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

function renderGrid() {
  gridEl.innerHTML = '';
  for (let r of ['A','B','C','D']) {
    for (let c = 1; c <= 5; c++) {
      const slot = `${r}${c}`;
      const item = core.inventory.get(slot);
      const card = document.createElement('div');
      card.className = 'slot';
      if (!item) card.classList.add('empty');
      card.innerHTML = item
        ? `<b>${item.product.name}</b><br>₹${item.product.price}<br><small>Qty: ${item.qty}</small>`
        : `<small>Empty</small>`;
      card.onclick = () => handleSelect(slot);
      gridEl.appendChild(card);
    }
  }
}

function handleSelect(slot) {
  const res = core.select(slot);
  if (!res.ok) return toast(res.msg);
  selectedSlot = slot;
  document.getElementById('itemName').textContent  = res.product.name;
  document.getElementById('itemPrice').textContent = res.price;
  checkoutEl.hidden = false;
  insertedEl.textContent = 0;
  dueOrChangeEl.textContent = `Insert ₹${res.price}`;
  renderBillButtons(res.price);
}

function renderBillButtons(price) {
  const box = document.getElementById('billButtons');
  box.innerHTML = '';
  [500,200,100,50,20,10,5,2,1].forEach(v => {
    const btn = document.createElement('button');
    btn.className = 'bill-btn';
    btn.textContent = `₹${v}`;
    btn.onclick = () => handleInsert(v);
    box.appendChild(btn);
  });
}

function handleInsert(bill) {
  const res = core.insert(bill);
  insertedEl.textContent = core.inserted;
  if (!res.ok) return toast(res.msg);
  // success
  dropZoneEl.textContent = res.product.name;
  dropZoneEl.classList.add('drop-anim');
  setTimeout(() => dropZoneEl.classList.remove('drop-anim'), 700);
  toast(`Enjoy your ${res.product.name}! Change: ₹${res.change.join(',')}`);
  checkoutEl.hidden = true;
  renderGrid();
}

renderGrid();