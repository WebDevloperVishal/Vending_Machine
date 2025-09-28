class Inventory {
  constructor() {
    // 4x5 grid  A1..D5
    this.slots = {};
    for (let r of ['A','B','C','D'])
      for (let c = 1; c <= 5; c++)
        this.slots[`${r}${c}`] = null;
    this.load();
  }

  // {product, qty}
  set(slot, product, qty = 5) {
    this.slots[slot] = { product, qty };
    this.save();
  }

  get(slot) {
    return this.slots[slot];
  }

  decrease(slot) {
    const item = this.slots[slot];
    if (!item) return;
    item.qty--;
    if (item.qty <= 0) this.slots[slot] = null;
    this.save();
  }

  report() {
    const map = {};
    Object.values(this.slots).forEach(item => {
      if (!item) return;
      const { product, qty } = item;
      if (!map[product.id]) map[product.id] = { ...product, sold: 0, left: 0 };
      map[product.id].left += qty;
    });
    return map;
  }

  save() {
    localStorage.setItem('inventory', JSON.stringify(this.slots));
  }

  load() {
    const raw = localStorage.getItem('inventory');
    if (raw) this.slots = JSON.parse(raw);
  }
}