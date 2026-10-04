const assert = require("assert");
const { calculateGP } = require("./gp");

assert.strictEqual(calculateGP(100, 1.00), 20);
assert.strictEqual(calculateGP(100, 1.25), 25);
assert.strictEqual(calculateGP(100, 1.50), 30);
assert.strictEqual(calculateGP(100, 1.75), 35);

assert.strictEqual(calculateGP(250, 1.25), 62.50);

assert.throws(() => calculateGP(0, 1.00));
assert.throws(() => calculateGP(100, 0));

console.log("✓ GP Engine : tous les tests sont réussis.");
