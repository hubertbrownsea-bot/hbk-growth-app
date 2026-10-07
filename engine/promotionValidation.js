/**
 * HBK Growth Engine
 * Promotion Engine
 *
 * Phase 5.3 — Validation administrative d'une promotion
 *
 * L'atteinte des seuils ne suffit pas à valider une promotion.
 * La validation ou le refus doit être effectué par une autorité habilitée.
 */

function validatePromotionRequest({
  request,
  decision,
  validatorId,
  motif,
}) {
  if (!request || typeof request !== "object") {
    throw new Error(
      "La demande de promotion est obligatoire."
    );
  }

  if (request.statut !== "EN_ATTENTE") {
    throw new Error(
      "Seule une demande en attente peut être traitée."
    );
  }

  if (
    typeof validatorId !== "string" ||
    validatorId.trim() === ""
  ) {
    throw new Error(
      "L'identifiant du validateur est obligatoire."
    );
  }

  if (
    decision !== "VALIDEE" &&
    decision !== "REFUSEE"
  ) {
    throw new Error(
      "La décision doit être VALIDEE ou REFUSEE."
    );
  }

  if (
    decision === "REFUSEE" &&
    (
      typeof motif !== "string" ||
      motif.trim() === ""
    )
  ) {
    throw new Error(
      "Le motif est obligatoire en cas de refus."
    );
  }

  return {
    ...request,
    statut: decision,
    validateurId: validatorId.trim(),
    motif:
      typeof motif === "string"
        ? motif.trim()
        : null,
  };
}

module.exports = {
  validatePromotionRequest,
};