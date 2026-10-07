/**
 * HBK Growth Engine
 * Promotion Persistence
 *
 * Phase 5.8.1 — Alignement avec le schéma Supabase
 *
 * Ce module ne communique pas encore avec Supabase.
 * Il transforme une promotion validée par le moteur
 * en objet compatible avec la table public.promotions.
 */

function preparePromotionRecord({
  promotionRequest,
  requestedAt,
  validatedAt,
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

  if (
    typeof promotionRequest.validateurId !== "string" ||
    promotionRequest.validateurId.trim() === ""
  ) {
    throw new Error(
      "L'identifiant du validateur est obligatoire."
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
    statut: "VALIDEE",
    motif: promotionRequest.motif || null,
    valide_par_commercial_id: promotionRequest.validateurId.trim(),
  };

  if (requestedAt !== undefined) {
    if (
      typeof requestedAt !== "string" ||
      requestedAt.trim() === ""
    ) {
      throw new Error(
        "La date de demande est invalide."
      );
    }

    record.date_demande = requestedAt;
  }

  if (validatedAt !== undefined) {
    if (
      typeof validatedAt !== "string" ||
      validatedAt.trim() === ""
    ) {
      throw new Error(
        "La date de validation est invalide."
      );
    }

    record.date_validation = validatedAt;
  }

  return record;
}

module.exports = {
  preparePromotionRecord,
};
