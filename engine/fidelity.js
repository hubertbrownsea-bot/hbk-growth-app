/**
 * HBK Growth Engine
 * Fidelity Engine
 *
 * Règle officielle :
 * 1er service distinct  -> coefficient 1.00
 * 2e service distinct   -> coefficient 1.25
 * 3e service distinct   -> coefficient 1.50
 * 4e service et suivants -> coefficient 1.75
 */

/**
 * Retourne le coefficient de fidélisation
 * selon le nombre de services distincts achetés par le client.
 *
 * @param {number} distinctServiceCount
 * @returns {number}
 */
function getFidelityCoefficient(distinctServiceCount) {
  if (!Number.isInteger(distinctServiceCount) || distinctServiceCount < 1) {
    throw new Error(
      "Le nombre de services distincts doit être un entier supérieur ou égal à 1."
    );
  }

  if (distinctServiceCount === 1) {
    return 1.00;
  }

  if (distinctServiceCount === 2) {
    return 1.25;
  }

  if (distinctServiceCount === 3) {
    return 1.50;
  }

  return 1.75;
}

module.exports = {
  getFidelityCoefficient,
};
