const assert = require("assert");

const { validatePayment } = require("./paymentValidator");
const { calculateDirectCommission } = require("./commission");
const { evaluateSpecialCommission } = require("./specialCommission");
const { calculateDeferredComplement } = require("./deferredCommission");

// ============================================================
// SCÉNARIO
// ============================================================
// 16e client acquis
// Grade actuel : G2
// Paiement : 100 USD
//
// Commission de base : 15 % = 15 USD
// Commission spéciale G3 : 25 %
// Le G3 n'est pas encore validé.
//
// Résultat attendu :
// 15 USD payés immédiatement
// 10 USD différés
// ============================================================

const payment = {
  amountCollected: 100,
  clientId: "client-016",
  serviceId: "service-001",
  commercialSellerId: "commercial-001",
  noteNumber: "NOTE-INTEGRATION-016",
  validationStatus: "VALIDER",
};

// 1. Validation du paiement
const validation = validatePayment(payment);

assert.strictEqual(validation.valid, true);
assert.strictEqual(validation.normalizedStatus, "VALIDE");

console.log("✓ Paiement validé.");

// 2. Commission directe
const directCommission = calculateDirectCommission(
  payment.amountCollected
);

assert.strictEqual(directCommission.rate, 0.15);
assert.strictEqual(directCommission.commission, 15);

console.log("✓ Commission directe : 15 USD.");

// 3. Évaluation de la commission spéciale
const specialCommission = evaluateSpecialCommission({
  acquiredClientCount: 16,
  currentGrade: 2,
  amountCollected: payment.amountCollected,
});

assert.strictEqual(specialCommission.triggered, true);
assert.strictEqual(specialCommission.requiredGrade, 3);
assert.strictEqual(specialCommission.specialRate, 0.25);
assert.strictEqual(specialCommission.status, "DEFERRED");
assert.strictEqual(
  specialCommission.deferredDifferenceRate,
  0.10
);

console.log(
  "✓ 16e client + G2 → complément de 10 % différé."
);

// 4. Validation ultérieure du G3
const deferredComplement = calculateDeferredComplement({
  amountCollected: payment.amountCollected,
  alreadyPaidRate: directCommission.rate,
  specialRate: specialCommission.specialRate,
  requiredGrade: specialCommission.requiredGrade,
  validatedGrade: 3,
  status: "EN_ATTENTE_GRADE",
});

assert.deepStrictEqual(deferredComplement, {
  payable: true,
  complementRate: 0.10,
  complementAmount: 10,
  status: "COMPLEMENT_DU",
});

console.log(
  "✓ G3 validé → complément rétroactif de 10 USD."
);

console.log(
  "✓ Intégration Commission → Spéciale → Différée : tous les tests sont réussis."
);
