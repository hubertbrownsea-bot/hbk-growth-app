/**
 * HBK Growth Engine
 * Special Commission Engine
 *
 * Règle :
 * La commission spéciale remplace la commission directe de base
 * lorsqu'un seuil de clients acquis est atteint.
 *
 * Si le seuil est atteint mais que le grade requis n'est pas encore
 * validé, la différence entre le taux spécial et le taux de base
 * est différée jusqu'à la validation du grade.
 */

const SPECIAL_THRESHOLDS = [
  { clients: 11, requiredGrade: 2, specialRate: 0.20 },
  { clients: 16, requiredGrade: 3, specialRate: 0.25 },
  { clients: 26, requiredGrade: 4, specialRate: 0.40 },
  { clients: 40, requiredGrade: 4, specialRate: 0.40 },
  { clients: 51, requiredGrade: 5, specialRate: 0.50 },
  { clients: 65, requiredGrade: 5, specialRate: 0.50 },
  { clients: 90, requiredGrade: 5, specialRate: 0.50 },
  { clients: 101, requiredGrade: 6, specialRate: 0.70 },
];

/**
 * Détermine le seuil de commission spéciale applicable.
 *
 * @param {number} acquiredClientCount
 * @returns {object|null}
 */
function findSpecialThreshold(acquiredClientCount) {
  const exactThreshold = SPECIAL_THRESHOLDS.find(
    (threshold) => acquiredClientCount === threshold.clients
  );

  if (exactThreshold) {
    return exactThreshold;
  }

  // À partir du 101e client, une nouvelle commission spéciale
  // intervient à chaque tranche supplémentaire de 10 clients.
  if (acquiredClientCount >= 101 && (acquiredClientCount - 101) % 10 === 0) {
    return {
      clients: acquiredClientCount,
      requiredGrade: 6,
      specialRate: 0.70,
    };
  }

  return null;
}

/**
 * Évalue la commission spéciale.
 *
 * @param {object} params
 * @param {number} params.acquiredClientCount
 * @param {number} params.currentGrade
 * @param {number} params.amountCollected
 *
 * @returns {object}
 */
function evaluateSpecialCommission({
  acquiredClientCount,
  currentGrade,
  amountCollected,
}) {
  if (
    !Number.isInteger(acquiredClientCount) ||
    acquiredClientCount < 0
  ) {
    throw new Error(
      "Le nombre de clients acquis doit être un entier supérieur ou égal à 0."
    );
  }

  if (
    !Number.isInteger(currentGrade) ||
    currentGrade < 1 ||
    currentGrade > 6
  ) {
    throw new Error(
      "Le grade actuel doit être un entier compris entre 1 et 6."
    );
  }

  if (
    typeof amountCollected !== "number" ||
    !Number.isFinite(amountCollected) ||
    amountCollected <= 0
  ) {
    throw new Error(
      "Le montant encaissé doit être un nombre strictement supérieur à 0."
    );
  }

  const threshold = findSpecialThreshold(acquiredClientCount);

  if (!threshold) {
    return {
      triggered: false,
    };
  }

  if (currentGrade < threshold.requiredGrade) {
    const baseRate = amountCollected < 50 ? 0.10 : 0.15;
    const deferredDifferenceRate = Number(
      (threshold.specialRate - baseRate).toFixed(2)
    );

    return {
      triggered: true,
      requiredGrade: threshold.requiredGrade,
      specialRate: threshold.specialRate,
      status: "DEFERRED",
      deferredDifferenceRate,
    };
  }

  return {
    triggered: true,
    requiredGrade: threshold.requiredGrade,
    specialRate: threshold.specialRate,
    status: "ACTIVE",
  };
}

module.exports = {
  SPECIAL_THRESHOLDS,
  findSpecialThreshold,
  evaluateSpecialCommission,
};
