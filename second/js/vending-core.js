/* global CashBox, Inventory */
const CATALOG = [
  { id: 1, name: 'Water',     price: 15 },
  { id: 2, name: 'Juice',     price: 35 },
  { id: 3, name: 'Soda',      price: 30 },
  { id: 4, name: 'Chips',     price: 20 },
  { id: 5, name: 'Chocolate', price: 45 },
  { id: 6, name: 'Gum',       price: 10 }
];

class VendingCore {
  constructor() {
    this.cashBox  = new CashBox();
    this.inventory = new Inventory();
    this.ledger   = []; // {product, price, timestamp}
    this.load();
  }

  // pick slot
  select(slot) {
    const item = this.inventory.get(slot);
    if (!item) return { ok: false, msg: 'Slot empty' };
    this.pending = { slot, item };
    return { ok: true, product: item.product, price: item.product.price };
  }

  // insert single bill
  insert(bill) {
    if (!this.pending) return { ok: false, msg: 'Nothing selected' };
    this.cashBox.accept(bill);
    this.inserted = (this.inserted || 0) + bill;
    const price = this.pending.item.product.price;
    if (this.inserted < price) {
      return { ok: false, msg: `Need ₹${price - this.inserted} more` };
    }
    const changeAmount = this.inserted - price;
    const { success, change, message } = this.cashBox.giveChange(changeAmount);
    if (!success) {
      // rollback
      this.cashBox.box[bill]--;
      this.inserted -= bill;
      return { ok: false, msg: message };
    }
    // complete sale
    this.inventory.decrease(this.pending.slot);
    this.ledger.push({ ...this.pending.item.product, price, time: Date.now() });
    this.save();
    const product = this.pending.item.product;
    this.reset();
    return { ok: true, product, change };
  }

  reset() {
    delete this.pending;
    delete this.inserted;
  }

  salesReport() {
    const map = {};
    this.ledger.forEach(s => {
      map[s.name] = (map[s.name] || 0) + 1;
    });
    return map;
  }

  save() {
    localStorage.setItem('ledger', JSON.stringify(this.ledger));
  }

  load() {
    const raw = localStorage.getItem('ledger');
    if (raw) this.ledger = JSON.parse(raw);
  }
}