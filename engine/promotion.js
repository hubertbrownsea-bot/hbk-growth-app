/**
 * HBK Growth Engine
 * Promotion Engine
 *
 * Phase 5.1 — Éligibilité à une promotion
 *
 * L'éligibilité est déterminée par deux critères :
 * 1. nombre de clients validés ;
 * 2. nombre de GP validés.
 *
 * L'atteinte des seuils ne valide pas automatiquement
 * la promotion.
 */

const PROMOTION_THRESHOLDS = {
  1: { clients: 5, gp: 30 },
  2: { clients: 10, gp: 75 },
  3: { clients: 15, gp: 135 },
  4: { clients: 25, gp: 250 },
  5: { clients: 50, gp: 550 },
  6: { clients: 100, gp: 1200 },
};

function evaluatePromotionEligibility({
  currentGrade,
  clientsValidated,
  gpValidated,
}) {
  if (
    !Number.isInteger(currentGrade) ||
    currentGrade < 1 ||
    currentGrade > 6
  ) {
    throw new Error(
      "Le grade actuel doit être un entier compris entre 1 et 5."
    );
  }

  if (
    !Number.isInteger(clientsValidated) ||
    clientsValidated < 0
  ) {
    throw new Error(
      "Le nombre de clients validés doit être un entier supérieur ou égal à 0."
    );
  }

  if (
    typeof gpValidated !== "number" ||
    !Number.isFinite(gpValidated) ||
    gpValidated < 0
  ) {
    throw new Error(
      "Les GP validés doivent être un nombre supérieur ou égal à 0."
    );
  }

 if (currentGrade === 6) {
  return {
    eligible: false,
    targetGrade: null,
    reason: "Le commercial a déjà atteint le grade maximal.",
  };
}

const targetGrade = currentGrade + 1;
const threshold = PROMOTION_THRESHOLDS[currentGrade];

  const clientsMet = clientsValidated >= threshold.clients;
  const gpMet = gpValidated >= threshold.gp;

  return {
    eligible: clientsMet && gpMet,
    targetGrade,
    requiredClients: threshold.clients,
    requiredGp: threshold.gp,
    clientsMet,
    gpMet,
  };
}

module.exports = {
  PROMOTION_THRESHOLDS,
  evaluatePromotionEligibility,
};