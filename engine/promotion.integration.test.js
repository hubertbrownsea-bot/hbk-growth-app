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
// SCÉNARIO INTÉGRÉ
//
// Commercial G1
// → 5 clients validés
// → 30 GP validés
// → éligible G2
// → demande de promotion
// → validation administrative
// → application du grade G2
// ============================================================

let currentGrade = 1;

const commercialId = "commercial-integration-001";

// ============================================================
// 1. Vérification de l'éligibilité
// ============================================================

const eligibility = evaluatePromotionEligibility({
  currentGrade,
  clientsValidated: 5,
  gpValidated: 30,
});

assert.strictEqual(eligibility.eligible, true);
assert.strictEqual(eligibility.targetGrade, 2);
assert.strictEqual(eligibility.requiredClients, 5);
assert.strictEqual(eligibility.requiredGp, 30);

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

assert.strictEqual(
  promotionRequest.ancienGrade,
  1
);

assert.strictEqual(
  promotionRequest.nouveauGrade,
  2
);

// Le grade n'a pas encore changé.
assert.strictEqual(currentGrade, 1);

// ============================================================
// 3. Validation administrative
// ============================================================

const validatedRequest = validatePromotionRequest({
  request: promotionRequest,
  decision: "VALIDEE",
  validatorId: "coordination-001",
});

assert.strictEqual(
  validatedRequest.statut,
  "VALIDEE"
);

assert.strictEqual(
  validatedRequest.validateurId,
  "coordination-001"
);

// Le grade n'a toujours pas changé.
// La validation administrative et l'application du grade
// sont deux opérations distinctes.
assert.strictEqual(currentGrade, 1);

// ============================================================
// 4. Application effective du grade
// ============================================================

const promotionResult = applyGradePromotion({
  currentGrade,
  promotionRequest: validatedRequest,
});

assert.strictEqual(
  promotionResult.ancienGrade,
  1
);

assert.strictEqual(
  promotionResult.nouveauGrade,
  2
);

assert.strictEqual(
  promotionResult.promotionAppliquee,
  true
);

// Mise à jour simulée du grade du commercial.
currentGrade = promotionResult.nouveauGrade;

// ============================================================
// 5. Vérification finale
// ============================================================

assert.strictEqual(currentGrade, 2);

// Le commercial G2 doit maintenant être évalué
// sur les seuils du grade suivant : G3.
const nextEligibility = evaluatePromotionEligibility({
  currentGrade,
  clientsValidated: 10,
  gpValidated: 75,
});

assert.strictEqual(nextEligibility.eligible, true);
assert.strictEqual(nextEligibility.targetGrade, 3);

console.log(
  "Tous les tests d'intégration du Promotion Engine 5.5 sont passés."
);