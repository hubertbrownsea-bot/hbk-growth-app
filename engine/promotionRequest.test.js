const assert = require("assert");

const {
  evaluatePromotionEligibility,
} = require("./promotion");

const {
  createPromotionRequest,
} = require("./promotionRequest");

// ============================================================
// Cas valide : G1 -> G2
// ============================================================

const eligibility = evaluatePromotionEligibility({
  currentGrade: 1,
  clientsValidated: 7,
  gpValidated: 42,
});

const request = createPromotionRequest({
  commercialId: "commercial-001",
  currentGrade: 1,
  eligibility,
  clientsValidated: 7,
  gpValidated: 42,
});

assert.deepStrictEqual(request, {
  commercialId: "commercial-001",
  ancienGrade: 1,
  nouveauGrade: 2,
  clientsValides: 7,
  gpValides: 42,
  clientsRequis: 5,
  gpRequis: 30,
  statut: "EN_ATTENTE",
});

// ============================================================
// Cas valide : G4 -> G5
// ============================================================

const eligibilityG4 = evaluatePromotionEligibility({
  currentGrade: 4,
  clientsValidated: 30,
  gpValidated: 300,
});

const requestG4 = createPromotionRequest({
  commercialId: "commercial-002",
  currentGrade: 4,
  eligibility: eligibilityG4,
  clientsValidated: 30,
  gpValidated: 300,
});

assert.strictEqual(requestG4.ancienGrade, 4);
assert.strictEqual(requestG4.nouveauGrade, 5);
assert.strictEqual(requestG4.statut, "EN_ATTENTE");

// ============================================================
// Un commercial non éligible ne peut pas créer une demande
// ============================================================

const notEligible = evaluatePromotionEligibility({
  currentGrade: 1,
  clientsValidated: 4,
  gpValidated: 30,
});

assert.throws(
  () =>
    createPromotionRequest({
      commercialId: "commercial-003",
      currentGrade: 1,
      eligibility: notEligible,
      clientsValidated: 4,
      gpValidated: 30,
    }),
  /commercial éligible/
);

// ============================================================
// Le grade cible doit être exactement le grade suivant
// ============================================================

assert.throws(
  () =>
    createPromotionRequest({
      commercialId: "commercial-004",
      currentGrade: 1,
      eligibility: {
        eligible: true,
        targetGrade: 3,
        requiredClients: 5,
        requiredGp: 30,
      },
      clientsValidated: 5,
      gpValidated: 30,
    }),
  /grade cible/
);

// ============================================================
// Identifiant obligatoire
// ============================================================

assert.throws(
  () =>
    createPromotionRequest({
      commercialId: "",
      currentGrade: 1,
      eligibility,
      clientsValidated: 7,
      gpValidated: 42,
    }),
  /identifiant du commercial/
);

// ============================================================
// G6 ne peut pas faire l'objet d'une nouvelle promotion
// ============================================================

const eligibilityG6 = evaluatePromotionEligibility({
  currentGrade: 6,
  clientsValidated: 150,
  gpValidated: 1500,
});

assert.strictEqual(eligibilityG6.eligible, false);

assert.throws(
  () =>
    createPromotionRequest({
      commercialId: "commercial-006",
      currentGrade: 6,
      eligibility: eligibilityG6,
      clientsValidated: 150,
      gpValidated: 1500,
    }),
  /commercial éligible/
);

console.log(
  "Tous les tests du Promotion Request Engine 5.2 sont passés."
);