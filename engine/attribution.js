/**
 * HBK Growth Engine
 * Sale Attribution Engine
 *
 * Phase 3.1 — Vente normale
 *
 * Règle :
 * Une vente normale est attribuée à un seul commercial.
 *
 * Le commercial d'origine :
 * - reçoit 100 % de la commission ;
 * - reçoit 100 % des GP ;
 * - compte le client pour sa promotion.
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

module.exports = {
  attributeNormalSale,
};
