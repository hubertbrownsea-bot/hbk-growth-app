/**
 * HBK Growth Engine
 * Sale Attribution Engine
 *
 * Phase 3.1 — Vente normale
 * Phase 3.2 — Vente partagée
 * Phase 3.3 — Service supplémentaire vendu par un autre commercial
 */

// ============================================================
// PHASE 3.1 — VENTE NORMALE
// ============================================================

/**
 * Règles :
 * - 100 % de la commission pour le commercial d'origine ;
 * - 100 % des GP pour le commercial d'origine ;
 * - le client compte pour sa promotion.
 */
function attributeNormalSale({
  originCommercialId,
  amountCommission,
  gpGenerated,
}) {
  if (
    typeof originCommercialId !== "string" ||
    originCommercialId.trim() === ""
  ) {
    throw new Error("Le commercial d'origine est obligatoire.");
  }

  if (
    typeof amountCommission !== "number" ||
    !Number.isFinite(amountCommission) ||
    amountCommission < 0
  ) {
    throw new Error(
      "Le montant de commission doit être un nombre supérieur ou égal à 0."
    );
  }

  if (
    typeof gpGenerated !== "number" ||
    !Number.isFinite(gpGenerated) ||
    gpGenerated < 0
  ) {
    throw new Error(
      "Le nombre de GP générés doit être un nombre supérieur ou égal à 0."
    );
  }

  return {
    originCommercialId,
    concludingCommercialId: originCommercialId,
    commissionShare: 100,
    commissionAmount: Number(amountCommission.toFixed(2)),
    gpAttributed: Number(gpGenerated.toFixed(2)),
    countsForPromotion: true,
  };
}

// ============================================================
// PHASE 3.2 — VENTE PARTAGÉE
// ============================================================

/**
 * Règles :
 * - deux commerciaux différents ;
 * - commission répartie à 50/50 ;
 * - zéro GP pour les deux commerciaux ;
 * - aucun client comptabilisé pour la promotion ;
 * - conservation du montant total de commission.
 */
function attributeSharedSale({
  originCommercialId,
  concludingCommercialId,
  amountCommission,
}) {
  if (
    typeof originCommercialId !== "string" ||
    originCommercialId.trim() === ""
  ) {
    throw new Error("Le commercial d'origine est obligatoire.");
  }

  if (
    typeof concludingCommercialId !== "string" ||
    concludingCommercialId.trim() === ""
  ) {
    throw new Error("Le commercial concluant est obligatoire.");
  }

  if (originCommercialId === concludingCommercialId) {
    throw new Error(
      "Une vente partagée doit concerner deux commerciaux différents."
    );
  }

  if (
    typeof amountCommission !== "number" ||
    !Number.isFinite(amountCommission) ||
    amountCommission < 0
  ) {
    throw new Error(
      "Le montant de commission doit être un nombre supérieur ou égal à 0."
    );
  }

  const originCommissionAmount = Number(
    (amountCommission / 2).toFixed(2)
  );

  const concludingCommissionAmount = Number(
    (amountCommission - originCommissionAmount).toFixed(2)
  );

  return {
    originCommercialId,
    concludingCommercialId,
    commissionShare: 50,
    originCommissionAmount,
    concludingCommissionAmount,
    originGpAttributed: 0,
    concludingGpAttributed: 0,
    originCountsForPromotion: false,
    concludingCountsForPromotion: false,
  };
}

// ============================================================
// PHASE 3.3 — SERVICE SUPPLÉMENTAIRE VENDU PAR UN AUTRE
// COMMERCIAL
// ============================================================

/**
 * Règles :
 * - le client reste rattaché au commercial d'origine ;
 * - commission répartie à 50/50 ;
 * - zéro GP pour les deux commerciaux ;
 * - aucun nouveau client comptabilisé pour la promotion ;
 * - justification obligatoire.
 */
function attributeAdditionalServiceSale({
  originCommercialId,
  concludingCommercialId,
  amountCommission,
  justification,
}) {
  if (
    typeof originCommercialId !== "string" ||
    originCommercialId.trim() === ""
  ) {
    throw new Error("Le commercial d'origine est obligatoire.");
  }

  if (
    typeof concludingCommercialId !== "string" ||
    concludingCommercialId.trim() === ""
  ) {
    throw new Error("Le commercial concluant est obligatoire.");
  }

  if (originCommercialId === concludingCommercialId) {
    throw new Error(
      "Une vente supplémentaire par un autre commercial doit concerner deux commerciaux différents."
    );
  }

  if (
    typeof amountCommission !== "number" ||
    !Number.isFinite(amountCommission) ||
    amountCommission < 0
  ) {
    throw new Error(
      "Le montant de commission doit être un nombre supérieur ou égal à 0."
    );
  }

  if (
    typeof justification !== "string" ||
    justification.trim() === ""
  ) {
    throw new Error(
      "La justification du service supplémentaire est obligatoire."
    );
  }

  const originCommissionAmount = Number(
    (amountCommission / 2).toFixed(2)
  );

  const concludingCommissionAmount = Number(
    (amountCommission - originCommissionAmount).toFixed(2)
  );

  return {
    originCommercialId,
    concludingCommercialId,
    commissionShare: 50,
    originCommissionAmount,
    concludingCommissionAmount,
    originGpAttributed: 0,
    concludingGpAttributed: 0,
    originCountsForPromotion: false,
    concludingCountsForPromotion: false,
    justification: justification.trim(),
  };
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  attributeNormalSale,
  attributeSharedSale,
  attributeAdditionalServiceSale,
};
