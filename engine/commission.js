/**
 * HBK Growth Engine
 * Commission Engine
 *
 * Commission directe :
 * - montant < 50 USD  → 10 %
 * - montant >= 50 USD → 15 %
 *
 * La commission est calculée sur le montant effectivement encaissé.
 */

function calculateDirectCommission(amountCollected) {
  if (
    typeof amountCollected !== "number" ||
    !Number.isFinite(amountCollected) ||
    amountCollected <= 0
  ) {
    throw new Error(
      "Le montant encaissé doit être un nombre strictement supérieur à 0."
    );
  }

  const rate = amountCollected < 50 ? 0.10 : 0.15;
  const commission = Number((amountCollected * rate).toFixed(2));

  return {
    rate,
    commission,
  };
}

module.exports = {
  calculateDirectCommission,
};
