/**
 * HBK Growth Engine
 * GP Engine
 *
 * Règle :
 * GP = montant encaissé / 5 × coefficient de fidélisation
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
