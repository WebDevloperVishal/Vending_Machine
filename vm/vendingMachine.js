class VendingMachine {
  constructor() {
    this.denoms = [500, 200, 100, 50, 20, 10, 5, 2, 1];
    this.products = [
      { id: 1, name: 'water',   price: 30 },
      { id: 2, name: 'juice',   price: 50 },
      { id: 3, name: 'soda',    price: 40 },
      { id: 4, name: 'chips',   price: 20 },
      { id: 5, name: 'chocolate', price: 80 }
    ];
    this.selectedProduct = null;
    this.balance = 0;
  }

  returnChange() {
    const coins = [];
    let remaining = this.balance - this.selectedProduct.price;
    for (const note of this.denoms) {
      while (remaining >= note) {
        coins.push(note);
        remaining -= note;
      }
    }
    return coins;
  }

  dispense(product) {
    this.products = this.products.filter(item => item.id !== product.id);
    this.balance = 0;
    this.returnChange();
  }

  restock(product) {
    if (this.products.find(item => item.id === product.id)) {
      return { ok: false, message: 'Given slot is busy, please choose another slot' };
    }
    this.products.push(product);
    return { ok: true, message: 'Product restocked' };
  }

  selectProduct(id) {
    const product = this.products.find(p => p.id === id);
    if (!product) return { ok: false, message: 'Unknown product' };
    this.selectedProduct = product;
    return { ok: true, message: 'Please insert the coins.' };
  }

  insertBills(bill) {
    if (!Number.isInteger(bill) || bill <= 0) {
      return { ok: false, message: 'Unknown bill' };
    }
    this.balance += bill;
    const due = this.selectedProduct.price - this.balance;
    if (due > 0) {
      return { ok: false, message: `Insert more ₹${due}` };
    }
    const change = this.returnChange();
    this.dispense(this.selectedProduct);
    return { ok: true, message: `Enjoy your ${this.selectedProduct.name}! Change: ₹[${change.join(',')}]` };
  }
}