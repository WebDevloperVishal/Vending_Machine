class VendingMachine {
  constructor() {
    // note denominations (₹)
    this.denoms = [500, 200, 100, 50, 20, 10, 5, 2, 1];

    // products available in the machine
    this.products = [
      { id: 1, name: 'water',   price: 30 },
      { id: 2, name: 'juice',   price: 50 },
      { id: 3, name: 'soda',    price: 40 },
      { id: 4, name: 'chips',   price: 20 },
      { id: 5, name: 'chocolate', price: 80 }
    ];

    this.selectedProduct = null;
    this.balance         = 0;
  }

  /* ---------- internal helpers ---------- */

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
    // remove the purchased product from the catalogue
    this.products = this.products.filter(item => item.id !== product.id);
    // give back change
    this.balance = 0;
    this.returnChange();
  }

  /* ---------- public API ---------- */

  restock(product) {
    const occupied = this.products.find(item => item.id === product.id);
    if (occupied) {
      return {
        ok: false,
        message: 'Given slot is busy, please choose another slot'
      };
    }
    this.products.push(product);
    return { ok: true, message: 'Product restocked' };
  }

  selectProduct(id) {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      return { ok: false, message: 'Unknown product' };
    }

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

    // enough money inserted
    this.dispense(this.selectedProduct);
    const change = this.returnChange();
    return { ok: true, message: `Enjoy your ${this.selectedProduct.name}! Change: ₹[${change.join(',')}]` };
  }
}

/* ---------- sample usage ---------- */

const vm = new VendingMachine();

// 1. pick an item
const selectRes = vm.selectProduct(1);   // chocolate (₹80)
if (!selectRes.ok) throw new Error(selectRes.message);
console.log(selectRes.message);          // "Please insert the coins."

// 2. pay
const payRes = vm.insertBills(500);      // insert a 500-rupee note
console.log(payRes.message);             // "Enjoy your chocolate! Change: ₹[200,200,20]"

// 3. inspect machine state
console.log(vm);
