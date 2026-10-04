/**
 * HBK Growth Engine
 * Payment Validator
 *
 * Rôle :
 * Vérifier qu'un paiement possède les informations minimales
 * nécessaires avant son entrée dans le Growth Engine.
 *
 * Le Payment Validator ne calcule :
 * - ni GP ;
 * - ni commission ;
 * - ni promotion.
 */

const VALIDATED_STATUSES = ["VALIDER", "VALIDE"];

function validatePayment(payment) {
  if (!payment || typeof payment !== "object") {
    throw new Error("Le paiement est obligatoire.");
  }

  if (
    typeof payment.amountCollected !== "number" ||
    !Number.isFinite(payment.amountCollected) ||
    payment.amountCollected <= 0
  ) {
    throw new Error(
      "Le montant encaissé doit être un nombre strictement supérieur à 0."
    );
  }

  if (!payment.clientId) {
    throw new Error("Le client est obligatoire.");
  }

  if (!payment.serviceId) {
    throw new Error("Le service est obligatoire.");
  }

  if (!payment.commercialSellerId) {
    throw new Error("Le commercial vendeur est obligatoire.");
  }

  if (
    typeof payment.noteNumber !== "string" ||
    payment.noteNumber.trim() === ""
  ) {
    throw new Error("Le numéro de note est obligatoire.");
  }

  if (!VALIDATED_STATUSES.includes(payment.validationStatus)) {
    throw new Error(
      "Le paiement doit être validé par le secrétariat."
    );
  }

  return {
    valid: true,
    normalizedStatus: "VALIDE",
  };
}

module.exports = {
  validatePayment,
};
