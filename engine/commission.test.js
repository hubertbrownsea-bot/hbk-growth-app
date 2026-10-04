const assert = require("assert");
const { calculateDirectCommission } = require("./commission");

// Moins de 50 USD → 10 %
assert.deepStrictEqual(
  calculateDirectCommission(40),
  {
    rate: 0.10,
    commission: 4.00,
  }
);

// 49,99 USD → 10 %
assert.deepStrictEqual(
  calculateDirectCommission(49.99),
  {
    rate: 0.10,
    commission: 5.00,
  }
);

// Exactement 50 USD → 15 %
assert.deepStrictEqual(
  calculateDirectCommission(50),
  {
    rate: 0.15,
    commission: 7.50,
  }
);

// 100 USD → 15 %
assert.deepStrictEqual(
  calculateDirectCommission(100),
  {
    rate: 0.15,
    commission: 15.00,
  }
);

// 250 USD → 15 %
assert.deepStrictEqual(
  calculateDirectCommission(250),
  {
    rate: 0.15,
    commission: 37.50,
  }
);

console.log("✓ Commission Engine : tests de commission directe définis.");
