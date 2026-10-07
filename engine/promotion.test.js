const assert = require("assert");

const {
  evaluatePromotionEligibility,
} = require("./promotion");

// ============================================================
// G1 -> G2 : 5 clients + 30 GP
// ============================================================

assert.strictEqual(
  evaluatePromotionEligibility({
    currentGrade: 1,
    clientsValidated: 5,
    gpValidated: 30,
  }).eligible,
  true
);

// Un seul critère atteint : pas d'éligibilité
assert.strictEqual(
  evaluatePromotionEligibility({
    currentGrade: 1,
    clientsValidated: 5,
    gpValidated: 29.99,
  }).eligible,
  false
);

assert.strictEqual(
  evaluatePromotionEligibility({
    currentGrade: 1,
    clientsValidated: 4,
    gpValidated: 30,
  }).eligible,
  false
);

// ============================================================
// G2 -> G3 : 10 clients + 75 GP
// ============================================================

assert.strictEqual(
  evaluatePromotionEligibility({
    currentGrade: 2,
    clientsValidated: 10,
    gpValidated: 75,
  }).eligible,
  true
);

// ============================================================
// G3 -> G4 : 15 clients + 135 GP
// ============================================================

assert.strictEqual(
  evaluatePromotionEligibility({
    currentGrade: 3,
    clientsValidated: 15,
    gpValidated: 135,
  }).eligible,
  true
);

// ============================================================
// G4 -> G5 : 25 clients + 250 GP
// ============================================================

assert.strictEqual(
  evaluatePromotionEligibility({
    currentGrade: 4,
    clientsValidated: 25,
    gpValidated: 250,
  }).eligible,
  true
);

// ============================================================
// G5 -> G6 : 50 clients + 550 GP
// ============================================================

assert.strictEqual(
  evaluatePromotionEligibility({
    currentGrade: 5,
    clientsValidated: 50,
    gpValidated: 550,
  }).eligible,
  true
);

// ============================================================
// G6 : aucun grade supérieur
// ============================================================

const gradeSixResult = evaluatePromotionEligibility({
  currentGrade: 6,
  clientsValidated: 100,
  gpValidated: 1200,
});

assert.strictEqual(gradeSixResult.eligible, false);
assert.strictEqual(gradeSixResult.targetGrade, null);

// ============================================================
// Validation des données
// ============================================================

assert.throws(
  () =>
    evaluatePromotionEligibility({
      currentGrade: 0,
      clientsValidated: 5,
      gpValidated: 30,
    }),
  /grade actuel/
);

assert.throws(
  () =>
    evaluatePromotionEligibility({
      currentGrade: 1,
      clientsValidated: -1,
      gpValidated: 30,
    }),
  /clients validés/
);

assert.throws(
  () =>
    evaluatePromotionEligibility({
      currentGrade: 1,
      clientsValidated: 5,
      gpValidated: -1,
    }),
  /GP validés/
);

console.log(
  "Tous les tests du Promotion Engine 5.1 sont passés."
);