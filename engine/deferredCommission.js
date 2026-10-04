/**
 * HBK Growth Engine
 * Deferred Commission Engine
 *
 * Règle :
 * Lorsqu'une commission spéciale est atteinte mais que le grade requis
 * n'est pas encore validé, la différence entre le taux déjà payé et
 * le taux spécial est différée.
 *
 * Après validation du grade requis, le complément devient payable.
 *
 * Exemple :
 * Paiement = 100 USD
 * Commission déjà payée = 15 % = 15 USD
 * Commission spéciale = 25 % = 25 USD
 * Complément = 10 % = 10 USD
 */

function calculateDeferredComplement({
  amountCollected,
  alreadyPaidRate,
  specialRate,
  requiredGrade,
  validatedGrade,
  status,
}) {
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
    typeof alreadyPaidRate !== "number" ||
    !Number.isFinite(alreadyPaidRate) ||
    alreadyPaidRate < 0
  ) {
    throw new Error(
      "Le taux déjà payé doit être un nombre supérieur ou égal à 0."
    );
  }

  if (
    typeof specialRate !== "number" ||
    !Number.isFinite(specialRate) ||
    specialRate < 0
  ) {
    throw new Error(
      "Le taux spécial doit être un nombre supérieur ou égal à 0."
    );
  }

  if (
    !Number.isInteger(requiredGrade) ||
    requiredGrade < 1 ||
    requiredGrade > 6
  ) {
    throw new Error(
      "Le grade requis doit être un entier compris entre 1 et 6."
    );
  }

  if (
    !Number.isInteger(validatedGrade) ||
    validatedGrade < 1 ||
    validatedGrade > 6
  ) {
    throw new Error(
      "Le grade validé doit être un entier compris entre 1 et 6."
    );
  }

  if (
    status !== "EN_ATTENTE_GRADE" &&
    status !== "COMPLEMENT_DU"
  ) {
    throw new Error(
      "Le statut du complément est invalide."
    );
  }

  // Si le complément a déjà été régularisé,
  // aucun second paiement ne doit être généré.
  if (status === "COMPLEMENT_DU") {
    return {
      payable: false,
      complementRate: 0,
      complementAmount: 0,
      status: "COMPLEMENT_DU",
    };
  }

  // Le grade requis n'est pas encore validé.
  if (validatedGrade < requiredGrade) {
    return {
      payable: false,
      complementRate: 0,
      complementAmount: 0,
      status: "EN_ATTENTE_GRADE",
    };
  }

  // Le grade requis est maintenant validé.
  const complementRate = Number(
    (specialRate - alreadyPaidRate).toFixed(2)
  );

  // Aucun complément si le taux déjà payé est égal
  // ou supérieur au taux spécial.
  if (complementRate <= 0) {
    return {
      payable: false,
      complementRate: 0,
      complementAmount: 0,
      status: "COMPLEMENT_DU",
    };
  }

  const complementAmount = Number(
    (amountCollected * complementRate).toFixed(2)
  );

  return {
    payable: true,
    complementRate,
    complementAmount,
    status: "COMPLEMENT_DU",
  };
}

module.exports = {
  calculateDeferredComplement,
};
