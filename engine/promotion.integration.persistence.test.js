/**
 * HBK Growth Engine
 * Promotion Persistence Integration Test
 *
 * Phase 5.8.4
 *
 * Vérifie le parcours complet :
 * éligibilité → demande → validation → persistance promotion
 * → mise à jour du grade.
 */

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
  preparePromotionRecord,
} = require("./promotionPersistence");

const {
  prepareGradeUpdate,
} = require("./gradePersistence");

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Échec du test : ${message}`);
  }
}

// Données de départ
const commercial = {
  id: "commercial-integration-1",
  grade: 1,
  clients: 5,
  gp: 30,
};

// 1. Vérifier l'éligibilité
const eligibility = evaluatePromotionEligibility({
  currentGrade: commercial.grade,
  clientsValidated: commercial.clients,
  gpValidated: commercial.gp,
});

assert(
  eligibility.eligible === true,
  "Le commercial doit être éligible à la promotion G1 → G2."
);

assert(
  eligibility.targetGrade === 2,
  "Le grade cible doit être G2."
);

// 2. Créer la demande de promotion
const request = createPromotionRequest({
  commercialId: commercial.id,
  currentGrade: commercial.grade,
  eligibility,
  clientsValidated: commercial.clients,
  gpValidated: commercial.gp,
});

assert(
  request.statut === "EN_ATTENTE",
  "La demande doit initialement être EN_ATTENTE."
);

assert(
  request.ancienGrade === 1,
  "L'ancien grade doit être G1."
);

assert(
  request.nouveauGrade === 2,
  "Le nouveau grade doit être G2."
);

// 3. Valider la demande
const validatedRequest = validatePromotionRequest({
  request,
  decision: "VALIDEE",
  validatorId: "coordination-hbk",
  motif: "Conditions de promotion vérifiées.",
});

assert(
  validatedRequest.statut === "VALIDEE",
  "La demande doit être VALIDEE."
);

assert(
  validatedRequest.validateurId === "coordination-hbk",
  "Le validateur doit être conservé."
);

// 4. Préparer l'enregistrement dans promotions
const promotionRecord = preparePromotionRecord({
  promotionRequest: validatedRequest,
  requestedAt: "2026-10-05T08:00:00.000Z",
  validatedAt: "2026-10-05T09:00:00.000Z",
});

assert(
  promotionRecord.commercial_id === commercial.id,
  "L'enregistrement promotion doit référencer le bon commercial."
);

assert(
  promotionRecord.ancien_grade === 1,
  "L'ancien grade de la promotion doit être G1."
);

assert(
  promotionRecord.nouveau_grade === 2,
  "Le nouveau grade de la promotion doit être G2."
);

assert(
  promotionRecord.statut === "VALIDEE",
  "La promotion persistée doit être VALIDEE."
);

assert(
  promotionRecord.valide_par_commercial_id === "coordination-hbk",
  "Le validateur doit être correctement enregistré."
);

// 5. Préparer la mise à jour de commerciaux.grade_actuel
const gradeUpdate = prepareGradeUpdate({
  commercialId: commercial.id,
  currentGrade: commercial.grade,
  promotionRequest: validatedRequest,
});

assert(
  gradeUpdate.commercial_id === commercial.id,
  "La mise à jour du grade doit cibler le bon commercial."
);

assert(
  gradeUpdate.grade_actuel === 2,
  "Le grade actuel doit passer de G1 à G2."
);

console.log(
  "Tous les tests d'intégration de la Promotion Persistence 5.8.4 sont passés."
);