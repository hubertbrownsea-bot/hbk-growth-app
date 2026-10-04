const assert = require("assert");
const { getFidelityCoefficient } = require("./fidelity");
const { calculateGP } = require("./gp");

// Cas métier : 2e service distinct acheté pour 100 USD
const coefficient = getFidelityCoefficient(2);
const gp = calculateGP(100, coefficient);

assert.strictEqual(coefficient, 1.25);
assert.strictEqual(gp, 25);

console.log("✓ Intégration Fidelity → GP : 100 USD / 2e service = 25 GP.");

// Cas supplémentaire : 4e service distinct acheté pour 100 USD
const coefficient4 = getFidelityCoefficient(4);
const gp4 = calculateGP(100, coefficient4);

assert.strictEqual(coefficient4, 1.75);
assert.strictEqual(gp4, 35);

console.log("✓ Intégration Fidelity → GP : 100 USD / 4e service = 35 GP.");
