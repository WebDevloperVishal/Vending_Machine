/* ================================================================
   VendingMachine class  (unchanged)
   ================================================================ */
class VendingMachine {
  constructor() {
    this.denoms = [500, 200, 100, 50, 20, 10, 5, 2, 1];
    this.products = [
      { id: 1, name: 'water',      price: 30 },
      { id: 2, name: 'juice',      price: 50 },
      { id: 3, name: 'soda',       price: 40 },
      { id: 4, name: 'chips',      price: 20 },
      { id: 5, name: 'chocolate',  price: 80 }
    ];
    this.selectedProduct = null;
    this.balance = 0;
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
    this.products = this.products.filter(item => item.id !== product.id);
    this.balance = 0;
    return this.returnChange();
  }

  /* ---------- public API ---------- */
  restock(product) {
    const occupied = this.products.find(item => item.id === product.id);
    if (occupied) {
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
    const change = this.dispense(this.selectedProduct);
    return {
      ok: true,
      message: `Enjoy your ${this.selectedProduct.name}! Change: ₹[${change.join(',')}]`
    };
  }
}

/* ================================================================
   Zero-input REPL  (no external deps)
   ================================================================ */
const vm = new VendingMachine();

const HELP = `
Commands:
  s <id>           select product by id
  i <bill>         insert one bill (₹1,2,5,10,20,50,100,200,500)
  r <id,name,price> restock a product
  p                print machine state
  h                help
  x                exit
`;

console.clear();
console.log('Vending-machine REPL ready. Type h for help.');

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'vm> '
});

rl.prompt();

rl.on('line', raw => {
  const [cmd, ...rest] = raw.trim().split(/\s+/);
  const arg = rest.join(' ');

  switch (cmd) {
    case 's': {
      const id = Number(arg);
      if (!Number.isInteger(id)) return console.log('  ❌  id must be integer');
      const res = vm.selectProduct(id);
      console.log(res.ok ? `  ✅  ${res.message}` : `  ❌  ${res.message}`);
      break;
    }
    case 'i': {
      const bill = Number(arg);
      if (!Number.isInteger(bill) || bill <= 0) return console.log('  ❌  invalid bill');
      const res = vm.insertBills(bill);
      console.log(`  ✅  ${res.message}`);
      break;
    }
    case 'r': {
      const [id, name, price] = arg.split(',');
      const res = vm.restock({ id: Number(id), name: name?.trim(), price: Number(price) });
      console.log(res.ok ? `  ✅  ${res.message}` : `  ❌  ${res.message}`);
      break;
    }
    case 'p':
      console.log('  balance : ₹' + vm.balance);
      console.log('  selected:', vm.selectedProduct);
      console.log('  products:', vm.products);
      break;
    case 'h':
      console.log(HELP);
      break;
    case 'x':
      rl.close();
      return;
    default:
      console.log('  ❌  unknown command. Type h for help.');
  }
  rl.prompt();
}).on('close', () => console.log('\nGood-bye!'));XMLDocument