/**
 * HBK Growth Engine
 * Grade Persistence
 *
 * Phase 5.8.3 — Préparation de la mise à jour du grade
 *
 * Ce module ne communique pas encore avec Supabase.
 * Il prépare uniquement les données nécessaires à la mise à jour
 * de commerciaux.grade_actuel.
 */

function prepareGradeUpdate({
  commercialId,
  currentGrade,
  promotionRequest,
}) {
  if (
    typeof commercialId !== "string" ||
    commercialId.trim() === ""
  ) {
    throw new Error(
      "L'identifiant du commercial est obligatoire."
    );
  }

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
      "Seule une promotion validée peut modifier le grade."
    );
  }

  if (
    !Number.isInteger(promotionRequest.ancienGrade) ||
    promotionRequest.ancienGrade !== currentGrade
  ) {
    throw new Error(
      "L'ancien grade de la promotion ne correspond pas au grade actuel."
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
    commercial_id: commercialId.trim(),
    grade_actuel: promotionRequest.nouveauGrade,
  };
}

module.exports = {
  prepareGradeUpdate,
};