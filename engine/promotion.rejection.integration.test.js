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

const {
  applyGradePromotion,
} = require("./gradePromotion");

// ============================================================
// SCÉNARIO : PROMOTION REFUSÉE
//
// G1
// → seuil atteint
// → éligible
// → demande créée
// → refus administratif
// → grade reste G1
// ============================================================

let currentGrade = 1;

const commercialId = "commercial-rejection-001";

// ============================================================
// 1. Éligibilité
// ============================================================

const eligibility = evaluatePromotionEligibility({
  currentGrade,
  clientsValidated: 5,
  gpValidated: 30,
});

assert.strictEqual(eligibility.eligible, true);
assert.strictEqual(eligibility.targetGrade, 2);

// ============================================================
// 2. Création de la demande
// ============================================================

const promotionRequest = createPromotionRequest({
  commercialId,
  currentGrade,
  eligibility,
  clientsValidated: 5,
  gpValidated: 30,
});

assert.strictEqual(
  promotionRequest.statut,
  "EN_ATTENTE"
);

// Le grade n'a pas encore changé.
assert.strictEqual(currentGrade, 1);

// ============================================================
// 3. Refus administratif
// ============================================================

const refusedRequest = validatePromotionRequest({
  request: promotionRequest,
  decision: "REFUSEE",
  validatorId: "coordination-001",
  motif: "Justificatifs insuffisants.",
});

assert.strictEqual(
  refusedRequest.statut,
  "REFUSEE"
);

assert.strictEqual(
  refusedRequest.validateurId,
  "coordination-001"
);

assert.strictEqual(
  refusedRequest.motif,
  "Justificatifs insuffisants."
);

// ============================================================
// 4. Une demande refusée ne peut pas être appliquée
// ============================================================

assert.throws(
  () =>
    applyGradePromotion({
      currentGrade,
      promotionRequest: refusedRequest,
    }),
  /promotion validée/
);

// ============================================================
// 5. Vérification finale
// ============================================================

// Le grade doit impérativement rester G1.
assert.strictEqual(currentGrade, 1);

console.log(
  "Tous les tests d'intégration du refus de promotion sont passés."
);