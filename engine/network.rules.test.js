const assert = require("assert");

const { getNetworkRate } = require("./network");
const {
  calculateNetworkCommission,
} = require("./networkCommission");

// ============================================================
// RÈGLE 1 — Un bénéficiaire sans droit au niveau concerné
// ne reçoit aucune commission réseau.
// ============================================================

// G4 : uniquement niveau 1
assert.strictEqual(getNetworkRate(4, 2), 0);
assert.strictEqual(
  calculateNetworkCommission(15, getNetworkRate(4, 2)),
  0
);

// G5 : niveaux 1 et 2, mais pas niveau 3
assert.strictEqual(getNetworkRate(5, 3), 0);
assert.strictEqual(
  calculateNetworkCommission(15, getNetworkRate(5, 3)),
  0
);

// G1-G3 : aucun droit réseau
assert.strictEqual(getNetworkRate(3, 1), 0);
assert.strictEqual(
  calculateNetworkCommission(15, getNetworkRate(3, 1)),
  0
);

// ============================================================
// RÈGLE 2 — Aucune commission directe effectivement payée
// = aucune commission réseau.
// ============================================================

assert.strictEqual(
  calculateNetworkCommission(0, 0.10),
  0
);

assert.strictEqual(
  calculateNetworkCommission(0, 0.05),
  0
);

assert.strictEqual(
  calculateNetworkCommission(0, 0.03),
  0
);

// ============================================================
// RÈGLE 3 — La commission réseau est calculée sur la
// commission directe effectivement payée, pas sur la vente.
// ============================================================

const amountCollected = 100;
const paidDirectCommission = 15;
const networkRate = 0.10;

const networkCommission = calculateNetworkCommission(
  paidDirectCommission,
  networkRate
);

assert.strictEqual(networkCommission, 1.50);

// Le calcul incorrect sur les 100 USD donnerait 10 USD.
// Le moteur ne doit jamais produire cette valeur.
assert.notStrictEqual(
  networkCommission,
  amountCollected * networkRate
);

console.log(
  "Tous les tests des règles métier du Network Engine sont passés."
);