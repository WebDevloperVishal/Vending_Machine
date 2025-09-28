const PIN = '1234';
const adminBtn   = document.getElementById('adminBtn');
const panel      = document.getElementById('adminPanel');
const pinInput   = document.getElementById('pinInput');
const unlockBtn  = document.getElementById('unlockBtn');
const functions  = document.getElementById('adminFunctions');
const out        = document.getElementById('adminOut');

adminBtn.onclick = () => panel.hidden = !panel.hidden;

unlockBtn.onclick = () => {
  if (pinInput.value === PIN) {
    functions.hidden = false;
    out.textContent = 'Unlocked\n';
  } else {
    out.textContent = 'Wrong PIN';
  }
};

document.getElementById('restockBtn').onclick = () => {
  const slot = prompt('Slot (e.g. A1)');
  if (!slot) return;
  const prodId = prompt('Product id (see console)');
  const qty = Number(prompt('Qty', '5'));
  const prod = CATALOG.find(p => p.id == prodId);
  if (!prod) return out.textContent = 'Bad product id';
  core.inventory.set(slot, prod, qty);
  out.textContent = `Restocked ${prod.name} at ${slot}`;
  renderGrid();
};

document.getElementById('collectBtn').onclick = () => {
  const loot = core.cashBox.withdraw();
  out.textContent = 'Collected:\n' + JSON.stringify(loot, null, 2);
};

document.getElementById('reportBtn').onclick = () => {
  const sales = core.salesReport();
  const inv   = core.inventory.report();
  out.textContent = 'Sales:\n' + JSON.stringify(sales, null, 2) +
                    '\n\nInventory:\n' + JSON.stringify(inv, null, 2);
};

document.getElementById('lockBtn').onclick = () => {
  functions.hidden = true;
  pinInput.value = '';
  out.textContent = 'Locked';
};