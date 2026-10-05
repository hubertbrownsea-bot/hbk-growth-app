const assert = require("assert");
const { getNetworkRate } = require("./network");

// G3 : aucun droit à une commission réseau
assert.strictEqual(getNetworkRate(3, 1), 0);

// G4 : 5 % au niveau 1 uniquement
assert.strictEqual(getNetworkRate(4, 1), 0.05);
assert.strictEqual(getNetworkRate(4, 2), 0);
assert.strictEqual(getNetworkRate(4, 3), 0);

// G5 : 8 % niveau 1, 3 % niveau 2
assert.strictEqual(getNetworkRate(5, 1), 0.08);
assert.strictEqual(getNetworkRate(5, 2), 0.03);
assert.strictEqual(getNetworkRate(5, 3), 0);

// G6 : 10 % niveau 1, 5 % niveau 2, 3 % niveau 3
assert.strictEqual(getNetworkRate(6, 1), 0.10);
assert.strictEqual(getNetworkRate(6, 2), 0.05);
assert.strictEqual(getNetworkRate(6, 3), 0.03);

// Grade invalide
assert.throws(
  () => getNetworkRate(0, 1),
  /grade doit être un entier compris entre 1 et 6/
);

assert.throws(
  () => getNetworkRate(7, 1),
  /grade doit être un entier compris entre 1 et 6/
);

// Niveau invalide
assert.throws(
  () => getNetworkRate(4, 0),
  /niveau de réseau doit être un entier compris entre 1 et 3/
);

assert.throws(
  () => getNetworkRate(4, 4),
  /niveau de réseau doit être un entier compris entre 1 et 3/
);

console.log("Tous les tests du Network Engine 4.1 sont passés.");