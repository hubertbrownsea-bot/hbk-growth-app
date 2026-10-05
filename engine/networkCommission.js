/**
 * HBK Growth Engine
 * Network Commission Engine
 *
 * Phase 4.3 — Calcul de la commission réseau
 *
 * La commission réseau est calculée sur la commission
 * directe effectivement payée au commercial vendeur.
 */

function calculateNetworkCommission(
  paidDirectCommission,
  networkRate
) {
  if (
    typeof paidDirectCommission !== "number" ||
    !Number.isFinite(paidDirectCommission) ||
    paidDirectCommission < 0
  ) {
    throw new Error(
      "La commission directe payée doit être un nombre supérieur ou égal à 0."
    );
  }

  if (
    typeof networkRate !== "number" ||
    !Number.isFinite(networkRate) ||
    networkRate < 0 ||
    networkRate > 1
  ) {
    throw new Error(
      "Le taux de commission réseau doit être compris entre 0 et 1."
    );
  }

  const commission = Number(
    (paidDirectCommission * networkRate).toFixed(2)
  );

  return commission;
}

module.exports = {
  calculateNetworkCommission,
};