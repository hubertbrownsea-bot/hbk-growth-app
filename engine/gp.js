/**
 * HBK Growth Engine
 * GP Engine
 *
 * Règle officielle :
 *
 * GP = montant encaissé / 5 × coefficient de fidélisation
 *
 * Le calcul des exceptions de partage est volontairement
 * séparé du présent module.
 */

/**
 * Calcule les GP générés par un paiement normal.
 *
 * @param {number} amountCollected
 * @param {number} fidelityCoefficient
 * @returns {number}
 */
function calculateGP(amountCollected, fidelityCoefficient) {
  if (
    typeof amountCollected !== "number" ||
    !Number.isFinite(amountCollected) ||
    amountCollected <= 0
  ) {
    throw new Error(
      "Le montant encaissé doit être un nombre strictement supérieur à 0."
    );
  }

  if (
    typeof fidelityCoefficient !== "number" ||
    !Number.isFinite(fidelityCoefficient) ||
    fidelityCoefficient <= 0
  ) {
    throw new Error(
      "Le coefficient de fidélisation doit être un nombre strictement supérieur à 0."
    );
  }

  const gp = (amountCollected / 5) * fidelityCoefficient;

  return Number(gp.toFixed(2));
}

module.exports = {
  calculateGP,
};
