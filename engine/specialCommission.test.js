const assert = require("assert");

const {
  evaluateSpecialCommission,
} = require("./specialCommission");

// ============================================================
// CAS 1 : 11e client avec G2 validé
// ============================================================

const case11 = evaluateSpecialCommission({
  acquiredClientCount: 11,
  currentGrade: 2,
  amountCollected: 100,
});

assert.deepStrictEqual(case11, {
  triggered: true,
  requiredGrade: 2,
  specialRate: 0.20,
  status: "ACTIVE",
});

console.log(
  "✓ 11e client + G2 validé → commission spéciale de 20 %."
);

// ============================================================
// CAS 2 : 16e client avec G2 seulement
// G3 est requis : la commission spéciale est différée.
// ============================================================

const case16Deferred = evaluateSpecialCommission({
  acquiredClientCount: 16,
  currentGrade: 2,
  amountCollected: 100,
});

assert.deepStrictEqual(case16Deferred, {
  triggered: true,
  requiredGrade: 3,
  specialRate: 0.25,
  status: "DEFERRED",
  deferredDifferenceRate: 0.10,
});

console.log(
  "✓ 16e client + G2 seulement → complément de 10 % différé."
);

// ============================================================
// CAS 3 : 16e client avec G3 validé
// ============================================================

const case16Active = evaluateSpecialCommission({
  acquiredClientCount: 16,
  currentGrade: 3,
  amountCollected: 100,
});

assert.deepStrictEqual(case16Active, {
  triggered: true,
  requiredGrade: 3,
  specialRate: 0.25,
  status: "ACTIVE",
});

console.log(
  "✓ 16e client + G3 validé → commission spéciale de 25 %."
);

// ============================================================
// CAS 4 : 10e client
// Aucun seuil de commission spéciale atteint.
// ============================================================

const case10 = evaluateSpecialCommission({
  acquiredClientCount: 10,
  currentGrade: 2,
  amountCollected: 100,
});

assert.deepStrictEqual(case10, {
  triggered: false,
});

console.log(
  "✓ 10e client → aucune commission spéciale."
);

console.log("✓ Special Commission Engine : tests métier définis.");

// ============================================================
// CONTRÔLE : les clients intermédiaires ne déclenchent pas
// une nouvelle commission spéciale
// ============================================================

const case12 = evaluateSpecialCommission({
  acquiredClientCount: 12,
  currentGrade: 2,
  amountCollected: 100,
});

assert.deepStrictEqual(case12, {
  triggered: false,
});

console.log(
  "✓ 12e client → aucune nouvelle commission spéciale."
);

const case17 = evaluateSpecialCommission({
  acquiredClientCount: 17,
  currentGrade: 3,
  amountCollected: 100,
});

assert.deepStrictEqual(case17, {
  triggered: false,
});

console.log(
  "✓ 17e client → aucune nouvelle commission spéciale."
);

// ============================================================
// CAS 5 : 26e client + G3
// G4 requis → commission différée
// ============================================================

const case26Deferred = evaluateSpecialCommission({
  acquiredClientCount: 26,
  currentGrade: 3,
  amountCollected: 100,
});

assert.deepStrictEqual(case26Deferred, {
  triggered: true,
  requiredGrade: 4,
  specialRate: 0.40,
  status: "DEFERRED",
  deferredDifferenceRate: 0.25,
});

console.log(
  "✓ 26e client + G3 → complément de 25 % différé."
);

// ============================================================
// CAS 6 : 26e client + G4
// ============================================================

const case26Active = evaluateSpecialCommission({
  acquiredClientCount: 26,
  currentGrade: 4,
  amountCollected: 100,
});

assert.deepStrictEqual(case26Active, {
  triggered: true,
  requiredGrade: 4,
  specialRate: 0.40,
  status: "ACTIVE",
});

console.log(
  "✓ 26e client + G4 → commission spéciale de 40 %."
);

// ============================================================
// CAS 7 : 101e client + G5
// G6 requis → commission différée
// ============================================================

const case101Deferred = evaluateSpecialCommission({
  acquiredClientCount: 101,
  currentGrade: 5,
  amountCollected: 100,
});

assert.deepStrictEqual(case101Deferred, {
  triggered: true,
  requiredGrade: 6,
  specialRate: 0.70,
  status: "DEFERRED",
  deferredDifferenceRate: 0.55,
});

console.log(
  "✓ 101e client + G5 → complément de 55 % différé."
);

// ============================================================
// CAS 8 : 111e client + G6
// ============================================================

const case111Active = evaluateSpecialCommission({
  acquiredClientCount: 111,
  currentGrade: 6,
  amountCollected: 100,
});

assert.deepStrictEqual(case111Active, {
  triggered: true,
  requiredGrade: 6,
  specialRate: 0.70,
  status: "ACTIVE",
});

console.log(
  "✓ 111e client + G6 → commission spéciale de 70 %."
);

// ============================================================
// CAS 9 : 112e client
// ============================================================

const case112 = evaluateSpecialCommission({
  acquiredClientCount: 112,
  currentGrade: 6,
  amountCollected: 100,
});

assert.deepStrictEqual(case112, {
  triggered: false,
});

console.log(
  "✓ 112e client → aucune nouvelle commission spéciale."
);

// ============================================================
// CAS 10 : montant inférieur à 50 USD
// Le taux de base est 10 %, donc le différé doit être 15 %
// pour le seuil G3 à 25 %.
// ============================================================

const case16SmallAmount = evaluateSpecialCommission({
  acquiredClientCount: 16,
  currentGrade: 2,
  amountCollected: 40,
});

assert.deepStrictEqual(case16SmallAmount, {
  triggered: true,
  requiredGrade: 3,
  specialRate: 0.25,
  status: "DEFERRED",
  deferredDifferenceRate: 0.15,
});

console.log(
  "✓ 16e client + paiement de 40 USD → complément différé de 15 %."
);
