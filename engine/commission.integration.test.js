const assert = require("assert");

const { validatePayment } = require("./paymentValidator");
const { calculateDirectCommission } = require("./commission");

// ============================================================
// CAS 1 : paiement validé
// ============================================================

const validPayment = {
  amountCollected: 100,
  clientId: "client-001",
  serviceId: "service-001",
  commercialSellerId: "commercial-001",
  noteNumber: "NOTE-003",
  validationStatus: "VALIDER",
};

const validation = validatePayment(validPayment);

assert.strictEqual(validation.valid, true);

const commission = calculateDirectCommission(
  validPayment.amountCollected
);

assert.strictEqual(commission.rate, 0.15);
assert.strictEqual(commission.commission, 15);

console.log(
  "✓ Paiement validé → commission de 15 USD sur 100 USD."
);

// ============================================================
// CAS 2 : paiement non validé
// ============================================================

const pendingPayment = {
  ...validPayment,
  noteNumber: "NOTE-004",
  validationStatus: "EN_ATTENTE",
};

assert.throws(
  () => validatePayment(pendingPayment),
  /validé par le secrétariat/
);

console.log(
  "✓ Paiement non validé → commission bloquée."
);
