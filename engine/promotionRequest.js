/**
 * HBK Growth Engine
 * Promotion Engine
 *
 * Phase 5.2 — Création d'une demande de promotion
 *
 * Cette fonction prépare une demande administrative.
 * Elle ne valide pas la promotion.
 */

function createPromotionRequest({
  commercialId,
  currentGrade,
  eligibility,
  clientsValidated,
  gpValidated,
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
    !eligibility ||
    typeof eligibility !== "object"
  ) {
    throw new Error(
      "Le résultat d'éligibilité est obligatoire."
    );
  }

  if (eligibility.eligible !== true) {
    throw new Error(
      "Une demande de promotion ne peut être créée que pour un commercial éligible."
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

  if (
    !Number.isInteger(eligibility.targetGrade) ||
    eligibility.targetGrade !== currentGrade + 1
  ) {
    throw new Error(
      "Le grade cible de la demande est invalide."
    );
  }

  return {
    commercialId: commercialId.trim(),
    ancienGrade: currentGrade,
    nouveauGrade: eligibility.targetGrade,
    clientsValides: clientsValidated,
    gpValides: Number(gpValidated.toFixed(2)),
    clientsRequis: eligibility.requiredClients,
    gpRequis: eligibility.requiredGp,
    statut: "EN_ATTENTE",
  };
}

module.exports = {
  createPromotionRequest,
};