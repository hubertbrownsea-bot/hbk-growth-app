const assert = require("assert");

const {
  evaluatePromotionEligibility,
} = require("./promotion");

const {
  createPromotionRequest,
} = require("./promotionRequest");

const {
  validatePromotionRequest,
} = require("./promotionValidation");

// ============================================================
// Préparation d'une demande valide G1 -> G2
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

// ============================================================
// Validation acceptée
// ============================================================

const validatedRequest = validatePromotionRequest({
  request,
  decision: "VALIDEE",
  validatorId: "coordination-001",
});

assert.strictEqual(validatedRequest.statut, "VALIDEE");
assert.strictEqual(
  validatedRequest.validateurId,
  "coordination-001"
);
assert.strictEqual(validatedRequest.motif, null);
assert.strictEqual(validatedRequest.ancienGrade, 1);
assert.strictEqual(validatedRequest.nouveauGrade, 2);

// ============================================================
// Refus avec motif
// ============================================================

const refusedRequest = validatePromotionRequest({
  request,
  decision: "REFUSEE",
  validatorId: "coordination-001",
  motif: "Pièces justificatives insuffisantes.",
});

assert.strictEqual(refusedRequest.statut, "REFUSEE");
assert.strictEqual(
  refusedRequest.validateurId,
  "coordination-001"
);
assert.strictEqual(
  refusedRequest.motif,
  "Pièces justificatives insuffisantes."
);

// ============================================================
// Un refus sans motif doit être rejeté
// ============================================================

assert.throws(
  () =>
    validatePromotionRequest({
      request,
      decision: "REFUSEE",
      validatorId: "coordination-001",
    }),
  /motif est obligatoire/
);

// ============================================================
// Une décision invalide doit être rejetée
// ============================================================

assert.throws(
  () =>
    validatePromotionRequest({
      request,
      decision: "APPROUVEE",
      validatorId: "coordination-001",
    }),
  /VALIDEE ou REFUSEE/
);

// ============================================================
// Un validateur sans identifiant doit être rejeté
// ============================================================

assert.throws(
  () =>
    validatePromotionRequest({
      request,
      decision: "VALIDEE",
      validatorId: "",
    }),
  /identifiant du validateur/
);

// ============================================================
// Une demande déjà traitée ne peut pas être retraitée
// ============================================================

assert.throws(
  () =>
    validatePromotionRequest({
      request: validatedRequest,
      decision: "REFUSEE",
      validatorId: "coordination-002",
      motif: "Nouvelle décision.",
    }),
  /demande en attente/
);

// ============================================================
// La validation ne modifie pas le grade actuel dans la demande
// ============================================================

assert.strictEqual(validatedRequest.ancienGrade, 1);
assert.strictEqual(validatedRequest.nouveauGrade, 2);

console.log(
  "Tous les tests du Promotion Validation Engine 5.3 sont passés."
);