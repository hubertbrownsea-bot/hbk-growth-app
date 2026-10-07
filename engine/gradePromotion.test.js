const assert = require("assert");

const {
  applyGradePromotion,
} = require("./gradePromotion");

// ============================================================
// Cas valide : G1 -> G2
// ============================================================

const resultG1 = applyGradePromotion({
  currentGrade: 1,
  promotionRequest: {
    statut: "VALIDEE",
    ancienGrade: 1,
    nouveauGrade: 2,
  },
});

assert.deepStrictEqual(resultG1, {
  ancienGrade: 1,
  nouveauGrade: 2,
  promotionAppliquee: true,
});

// ============================================================
// Cas valide : G5 -> G6
// ============================================================

const resultG5 = applyGradePromotion({
  currentGrade: 5,
  promotionRequest: {
    statut: "VALIDEE",
    ancienGrade: 5,
    nouveauGrade: 6,
  },
});

assert.strictEqual(resultG5.ancienGrade, 5);
assert.strictEqual(resultG5.nouveauGrade, 6);
assert.strictEqual(resultG5.promotionAppliquee, true);

// ============================================================
// Une demande EN_ATTENTE ne peut pas être appliquée
// ============================================================

assert.throws(
  () =>
    applyGradePromotion({
      currentGrade: 1,
      promotionRequest: {
        statut: "EN_ATTENTE",
        ancienGrade: 1,
        nouveauGrade: 2,
      },
    }),
  /promotion validée/
);

// ============================================================
// Une demande REFUSEE ne peut pas être appliquée
// ============================================================

assert.throws(
  () =>
    applyGradePromotion({
      currentGrade: 1,
      promotionRequest: {
        statut: "REFUSEE",
        ancienGrade: 1,
        nouveauGrade: 2,
      },
    }),
  /promotion validée/
);

// ============================================================
// Aucun saut de grade : G1 -> G3 interdit
// ============================================================

assert.throws(
  () =>
    applyGradePromotion({
      currentGrade: 1,
      promotionRequest: {
        statut: "VALIDEE",
        ancienGrade: 1,
        nouveauGrade: 3,
      },
    }),
  /grade suivant/
);

// ============================================================
// L'ancien grade doit correspondre au grade actuel
// ============================================================

assert.throws(
  () =>
    applyGradePromotion({
      currentGrade: 2,
      promotionRequest: {
        statut: "VALIDEE",
        ancienGrade: 1,
        nouveauGrade: 2,
      },
    }),
  /ne correspond pas/
);

// ============================================================
// Le grade maximal est G6
// ============================================================

assert.throws(
  () =>
    applyGradePromotion({
      currentGrade: 6,
      promotionRequest: {
        statut: "VALIDEE",
        ancienGrade: 6,
        nouveauGrade: 7,
      },
    }),
/grade maximal/
);

// ============================================================
// Grade actuel invalide
// ============================================================

assert.throws(
  () =>
    applyGradePromotion({
      currentGrade: 0,
      promotionRequest: {
        statut: "VALIDEE",
        ancienGrade: 0,
        nouveauGrade: 1,
      },
    }),
  /grade actuel/
);

// ============================================================
// Demande obligatoire
// ============================================================

assert.throws(
  () =>
    applyGradePromotion({
      currentGrade: 1,
      promotionRequest: null,
    }),
  /demande de promotion/
);

console.log(
  "Tous les tests du Grade Promotion Engine 5.4 sont passés."
);