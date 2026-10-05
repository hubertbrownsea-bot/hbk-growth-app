/**
 * HBK Growth Engine
 * Sale Attribution Engine
 *
 * Phase 3.1 — Vente normale
<<<<<<< HEAD
 * Phase 3.2 — Vente partagée
 */

// ============================================================
// PHASE 3.1 — VENTE NORMALE
// ============================================================

=======
 *
 * Règle :
 * Une vente normale est attribuée à un seul commercial.
 *
 * Le commercial d'origine :
 * - reçoit 100 % de la commission ;
 * - reçoit 100 % des GP ;
 * - compte le client pour sa promotion.
 */

>>>>>>> origin/main
function attributeNormalSale({
  originCommercialId,
  amountCommission,
  gpGenerated,
}) {
  if (
    typeof originCommercialId !== "string" ||
    originCommercialId.trim() === ""
  ) {
    throw new Error(
      "Le commercial d'origine est obligatoire."
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

<<<<<<< HEAD
// ============================================================
// PHASE 3.2 — VENTE PARTAGÉE
// ============================================================

/**
 * Règles officielles :
 *
 * - deux commerciaux différents ;
 * - commission répartie 50/50 ;
 * - 0 GP pour les deux ;
 * - aucun client comptabilisé pour la promotion ;
 * - le montant total de commission doit être conservé.
 *
 * Exemple :
 * Commission totale = 20 USD
 * Commercial origine = 10 USD
 * Commercial concluant = 10 USD
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
    throw new Error(
      "Le commercial d'origine est obligatoire."
    );
  }

  if (
    typeof concludingCommercialId !== "string" ||
    concludingCommercialId.trim() === ""
  ) {
    throw new Error(
      "Le commercial concluant est obligatoire."
    );
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
// EXPORTS
// ============================================================

module.exports = {
  attributeNormalSale,
  attributeSharedSale,
  attributeAdditionalServiceSale,
};// ============================================================
// PHASE 3.3 — SERVICE SUPPLÉMENTAIRE VENDU PAR UN AUTRE
// COMMERCIAL
// ============================================================

/**
 * Règles officielles :
 *
 * Le client reste définitivement rattaché au commercial d'origine.
 *
 * Lorsqu'un autre commercial vend un service supplémentaire :
 * - commission 50/50 entre origine et concluant ;
 * - 0 GP pour les deux ;
 * - aucun nouveau client pour le commercial concluant ;
 * - le client reste rattaché à l'origine ;
 * - la décision doit pouvoir être justifiée par le secrétariat.
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
    throw new Error(
      "Le commercial d'origine est obligatoire."
    );
  }

  if (
    typeof concludingCommercialId !== "string" ||
    concludingCommercialId.trim() === ""
  ) {
    throw new Error(
      "Le commercial concluant est obligatoire."
    );
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
=======
module.exports = {
  attributeNormalSale,
};
>>>>>>> origin/main
