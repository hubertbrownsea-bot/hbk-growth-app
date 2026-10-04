const assert = require("assert");

const { validatePayment } = require("./paymentValidator");
const { getFidelityCoefficient } = require("./fidelity");
const { calculateGP } = require("./gp");

// Paiement fictif valide
const payment = {
  amountCollected: 100,
  clientId: "client-001",
  serviceId: "service-002",
  commercialSellerId: "commercial-001",
  noteNumber: "NOTE-002",
  validationStatus: "VALIDER",
};

// 1. Validation du paiement
const validation = validatePayment(payment);

assert.strictEqual(validation.valid, true);
assert.strictEqual(validation.normalizedStatus, "VALIDE");

// 2. Le client achète son 2e service distinct
const distinctServiceCount = 2;

// 3. Détermination du coefficient
const coefficient = getFidelityCoefficient(distinctServiceCount);

assert.strictEqual(coefficient, 1.25);

// 4. Calcul des GP
const gp = calculateGP(payment.amountCollected, coefficient);

assert.strictEqual(gp, 25);

console.log(
  "✓ Intégration Payment → Fidelity → GP : 100 USD / 2e service = 25 GP."
);
