 /**
 * HBK Growth Engine
 * Promotion Engine
 *
 * Phase 5.4 — Application effective du nouveau grade
 *
 * Le changement de grade n'est autorisé que si la demande
 * de promotion a été administrativement validée.
 */

function applyGradePromotion({
  currentGrade,
  promotionRequest,
}) {
  if (
    !Number.isInteger(currentGrade) ||
    currentGrade < 1 ||
    currentGrade > 6
  ) {
    throw new Error(
      "Le grade actuel doit être un entier compris entre 1 et 6."
    );
  }

  if (
    !promotionRequest ||
    typeof promotionRequest !== "object"
  ) {
    throw new Error(
      "La demande de promotion est obligatoire."
    );
  }

  if (promotionRequest.statut !== "VALIDEE") {
    throw new Error(
      "Seule une promotion validée peut être appliquée."
    );
  }

  if (
    !Number.isInteger(promotionRequest.ancienGrade) ||
    promotionRequest.ancienGrade !== currentGrade
  ) {
    throw new Error(
      "L'ancien grade de la demande ne correspond pas au grade actuel."
    );
  }

  if (
    !Number.isInteger(promotionRequest.nouveauGrade) ||
    promotionRequest.nouveauGrade !== currentGrade + 1
  ) {
    throw new Error(
      "Le nouveau grade doit être exactement le grade suivant."
    );
  }

  if (promotionRequest.nouveauGrade > 6) {
    throw new Error(
      "Le grade maximal autorisé est le grade 6."
    );
  }

  return {
    ancienGrade: currentGrade,
    nouveauGrade: promotionRequest.nouveauGrade,
    promotionAppliquee: true,
  };
}

module.exports = {
  applyGradePromotion,
};