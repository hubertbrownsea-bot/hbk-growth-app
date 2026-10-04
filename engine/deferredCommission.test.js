const assert = require("assert");

const { calculateDeferredComplement } = require("./deferredCommission");

// CAS 1 : G3 validé après un différé de 10 %
const case1 = calculateDeferredComplement({
  amountCollected: 100,
  alreadyPaidRate: 0.15,
  specialRate: 0.25,
  requiredGrade: 3,
  validatedGrade: 3,
  status: "EN_ATTENTE_GRADE",
});

assert.deepStrictEqual(case1, {
  payable: true,
  complementRate: 0.10,
  complementAmount: 10,
  status: "COMPLEMENT_DU",
});

console.log(
  "✓ G3 validé → complément de 10 USD sur un paiement de 100 USD."
);

// CAS 2 : grade encore insuffisant
const case2 = calculateDeferredComplement({
  amountCollected: 100,
  alreadyPaidRate: 0.15,
  specialRate: 0.25,
  requiredGrade: 3,
  validatedGrade: 2,
  status: "EN_ATTENTE_GRADE",
});

assert.deepStrictEqual(case2, {
  payable: false,
  complementRate: 0,
  complementAmount: 0,
  status: "EN_ATTENTE_GRADE",
});

console.log("✓ Grade insuffisant → complément toujours différé.");

// CAS 3 : complément déjà régularisé
const case3 = calculateDeferredComplement({
  amountCollected: 100,
  alreadyPaidRate: 0.15,
  specialRate: 0.25,
  requiredGrade: 3,
  validatedGrade: 3,
  status: "COMPLEMENT_DU",
});

assert.deepStrictEqual(case3, {
  payable: false,
  complementRate: 0,
  complementAmount: 0,
  status: "COMPLEMENT_DU",
});

console.log("✓ Complément déjà régularisé → aucun second paiement.");

// CAS 4 : montant inférieur à 50 USD
const case4 = calculateDeferredComplement({
  amountCollected: 40,
  alreadyPaidRate: 0.10,
  specialRate: 0.25,
  requiredGrade: 3,
  validatedGrade: 3,
  status: "EN_ATTENTE_GRADE",
});

assert.deepStrictEqual(case4, {
  payable: true,
  complementRate: 0.15,
  complementAmount: 6,
  status: "COMPLEMENT_DU",
});

console.log("✓ Paiement de 40 USD → complément de 6 USD.");

console.log("✓ Deferred Commission Engine : tests métier définis.");