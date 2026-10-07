/**
 * HBK Growth Engine
 * Promotion Persistence
 *
 * Phase 5.7 — Préparation de la persistance
 *
 * Ce module ne communique pas encore avec Supabase.
 * Il transforme une demande de promotion validée par le moteur
 * en objet compatible avec la couche de persistance.
 */

function preparePromotionRecord({
  promotionRequest,
  createdAt,
}) {
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
      "Seule une promotion validée peut être préparée pour la persistance."
    );
  }

  if (
    typeof promotionRequest.commercialId !== "string" ||
    promotionRequest.commercialId.trim() === ""
  ) {
    throw new Error(
      "L'identifiant du commercial est obligatoire."
    );
  }

  if (
    !Number.isInteger(promotionRequest.ancienGrade) ||
    !Number.isInteger(promotionRequest.nouveauGrade)
  ) {
    throw new Error(
      "Les grades de la promotion sont obligatoires."
    );
  }

  if (
    promotionRequest.nouveauGrade !==
    promotionRequest.ancienGrade + 1
  ) {
    throw new Error(
      "La promotion doit correspondre au grade immédiatement supérieur."
    );
  }

  if (
    !Number.isInteger(promotionRequest.clientsValides) ||
    promotionRequest.clientsValides < 0
  ) {
    throw new Error(
      "Le nombre de clients valides est invalide."
    );
  }

  if (
    typeof promotionRequest.gpValides !== "number" ||
    !Number.isFinite(promotionRequest.gpValides) ||
    promotionRequest.gpValides < 0
  ) {
    throw new Error(
      "Le nombre de GP valides est invalide."
    );
  }

  const record = {
    commercial_id: promotionRequest.commercialId.trim(),
    ancien_grade: promotionRequest.ancienGrade,
    nouveau_grade: promotionRequest.nouveauGrade,
    clients_valides: promotionRequest.clientsValides,
    gp_valides: Number(
      promotionRequest.gpValides.toFixed(2)
    ),
    statut: promotionRequest.statut,
    motif: promotionRequest.motif || null,
    validateur: promotionRequest.validateurId || null,
  };

  if (createdAt !== undefined) {
    if (
      typeof createdAt !== "string" ||
      createdAt.trim() === ""
    ) {
      throw new Error(
        "La date de création est invalide."
      );
    }

    record.date_creation = createdAt;
  }

  return record;
}

module.exports = {
  preparePromotionRecord,
};