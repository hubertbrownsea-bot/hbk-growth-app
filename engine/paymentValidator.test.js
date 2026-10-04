const assert = require("assert");
const { validatePayment } = require("./paymentValidator");

const validPayment = {
  amountCollected: 100,
  clientId: "client-001",
  serviceId: "service-001",
  commercialSellerId: "commercial-001",
  noteNumber: "NOTE-001",
  validationStatus: "VALIDER",
};

// Paiement valide
const result = validatePayment(validPayment);

assert.strictEqual(result.valid, true);
assert.strictEqual(result.normalizedStatus, "VALIDE");

// Le statut canonique VALIDE doit également être accepté
const validCanonicalStatus = {
  ...validPayment,
  validationStatus: "VALIDE",
};

assert.strictEqual(
  validatePayment(validCanonicalStatus).valid,
  true
);

// Montant invalide
assert.throws(
  () =>
    validatePayment({
      ...validPayment,
      amountCollected: 0,
    }),
  /montant encaissé/
);

// Client absent
assert.throws(
  () =>
    validatePayment({
      ...validPayment,
      clientId: null,
    }),
  /client est obligatoire/
);

// Service absent
assert.throws(
  () =>
    validatePayment({
      ...validPayment,
      serviceId: null,
    }),
  /service est obligatoire/
);

// Commercial absent
assert.throws(
  () =>
    validatePayment({
      ...validPayment,
      commercialSellerId: null,
    }),
  /commercial vendeur est obligatoire/
);

// Numéro de note absent
assert.throws(
  () =>
    validatePayment({
      ...validPayment,
      noteNumber: "",
    }),
  /numéro de note est obligatoire/
);

// Paiement non validé
assert.throws(
  () =>
    validatePayment({
      ...validPayment,
      validationStatus: "EN_ATTENTE",
    }),
  /validé par le secrétariat/
);

console.log("✓ Payment Validator : tous les tests sont réussis.");
