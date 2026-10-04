const assert = require("assert");

const {
  calculateDeferredComplement,
} = require("./deferredCommission");

// ============================================================
// CAS 1 : grade toujours insuffisant
// ============================================================

const insufficientGrade = calculateDeferredComplement({
  amountCollected: 100,
  alreadyPaidRate: 0.15,
  specialRate: 0.25,
  requiredGrade: 3,
  validatedGrade: 2,
  status: "EN_ATTENTE_GRADE",
});

assert.deepStrictEqual(insufficientGrade, {
  payable: false,
  complementRate: 0,
  complementAmount: 0,
  status: "EN_ATTENTE_GRADE",
});

console.log(
  "✓ Grade insuffisant → aucun complément payé."
);

// ============================================================
// CAS 2 : complément déjà régularisé
// ============================================================

const alreadyPaid = calculateDeferredComplement({
  amountCollected: 100,
  alreadyPaidRate: 0.15,
  specialRate: 0.25,
  requiredGrade: 3,
  validatedGrade: 3,
  status: "COMPLEMENT_DU",
});

assert.deepStrictEqual(alreadyPaid, {
  payable: false,
  complementRate: 0,
  complementAmount: 0,
  status: "COMPLEMENT_DU",
});

console.log(
  "✓ Complément déjà régularisé → aucun double paiement."
);

// ============================================================
// CAS 3 : paiement inférieur à 50 USD
// Base : 10 %
// Spécial : 25 %
// Complément : 15 %
// 40 × 15 % = 6 USD
// ============================================================

const smallPayment = calculateDeferredComplement({
  amountCollected: 40,
  alreadyPaidRate: 0.10,
  specialRate: 0.25,
  requiredGrade: 3,
  validatedGrade: 3,
  status: "EN_ATTENTE_GRADE",
});

assert.deepStrictEqual(smallPayment, {
  payable: true,
  complementRate: 0.15,
  complementAmount: 6,
  status: "COMPLEMENT_DU",
});

console.log(
  "✓ Paiement de 40 USD → complément correct de 6 USD."
);

// ============================================================
// CAS 4 : taux déjà payé supérieur au taux spécial
// Aucun montant supplémentaire ne doit être généré.
// ============================================================

const noAdditionalPayment = calculateDeferredComplement({
  amountCollected: 100,
  alreadyPaidRate: 0.25,
  specialRate: 0.20,
  requiredGrade: 3,
  validatedGrade: 3,
  status: "EN_ATTENTE_GRADE",
});

assert.deepStrictEqual(noAdditionalPayment, {
  payable: false,
  complementRate: 0,
  complementAmount: 0,
  status: "COMPLEMENT_DU",
});

console.log(
  "✓ Taux déjà payé supérieur au taux spécial → aucun complément."
);

console.log(
  "✓ Deferred Commission Engine : tests de robustesse réussis."
);
