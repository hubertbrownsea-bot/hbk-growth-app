const assert = require("assert");
const {
  calculateNetworkCommission,
} = require("./networkCommission");

// 15 USD de commission directe × 5 % = 0,75 USD
assert.strictEqual(
  calculateNetworkCommission(15, 0.05),
  0.75
);

// 15 USD × 8 % = 1,20 USD
assert.strictEqual(
  calculateNetworkCommission(15, 0.08),
  1.20
);

// 15 USD × 3 % = 0,45 USD
assert.strictEqual(
  calculateNetworkCommission(15, 0.03),
  0.45
);

// 0 USD de commission directe = 0 USD de commission réseau
assert.strictEqual(
  calculateNetworkCommission(0, 0.10),
  0
);

// Taux nul = 0
assert.strictEqual(
  calculateNetworkCommission(15, 0),
  0
);

// Refus d'une commission directe négative
assert.throws(
  () => calculateNetworkCommission(-1, 0.05),
  /commission directe payée/
);

// Refus d'un taux négatif
assert.throws(
  () => calculateNetworkCommission(15, -0.05),
  /taux de commission réseau/
);

// Refus d'un taux supérieur à 100 %
assert.throws(
  () => calculateNetworkCommission(15, 1.01),
  /taux de commission réseau/
);

// Refus d'un montant non numérique
assert.throws(
  () => calculateNetworkCommission("15", 0.05),
  /commission directe payée/
);

console.log(
  "Tous les tests du Network Commission Engine 4.3 sont passés."
);