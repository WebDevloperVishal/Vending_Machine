class CashBox {
  constructor() {
    // start with a reasonable float
    this.box = {
      500: 5,
      200: 10,
      100: 20,
      50: 20,
      20: 50,
      10: 50,
      5: 100,
      2: 100,
      1: 100
    };
    this.load();
  }

  get total() {
    return Object.entries(this.box)
                 .reduce((sum, [v, q]) => sum + v * q, 0);
  }

  // return {success, change[], message}
  giveChange(amount) {
    const change = [];
    const temp = { ...this.box };
    let left = amount;

    for (const note of [500, 200, 100, 50, 20, 10, 5, 2, 1]) {
      while (left >= note && temp[note] > 0) {
        change.push(note);
        left -= note;
        temp[note]--;
      }
    }

    if (left !== 0) {
      return { success: false, change: [], message: 'Exact change not available' };
    }

    // commit
    this.box = temp;
    this.save();
    return { success: true, change, message: '' };
  }

  accept(bill) {
    this.box[bill] = (this.box[bill] || 0) + 1;
    this.save();
  }

  withdraw() {
    const loot = { ...this.box };
    Object.keys(this.box).forEach(k => this.box[k] = 0);
    this.save();
    return loot;
  }

  save() {
    localStorage.setItem('cashBox', JSON.stringify(this.box));
  }

  load() {
    const raw = localStorage.getItem('cashBox');
    if (raw) this.box = JSON.parse(raw);
  }
}