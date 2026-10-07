/**
 * HBK Growth Engine
 * Grade Persistence Tests
 *
 * Phase 5.8.3
 */

const {
  prepareGradeUpdate,
} = require("./gradePersistence");

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Échec du test : ${message}`);
  }
}

function assertThrows(fn, expectedMessage) {
  let thrown = false;

  try {
    fn();
  } catch (error) {
    thrown = true;

    assert(
      error.message.includes(expectedMessage),
      `Message attendu contenant "${expectedMessage}", reçu "${error.message}"`
    );
  }

  assert(thrown, `Une erreur était attendue : "${expectedMessage}"`);
}

// 1. Promotion valide G1 → G2
{
  const result = prepareGradeUpdate({
    commercialId: "commercial-1",
    currentGrade: 1,
    promotionRequest: {
      statut: "VALIDEE",
      ancienGrade: 1,
      nouveauGrade: 2,
    },
  });

  assert(
    result.commercial_id === "commercial-1",
    "L'identifiant du commercial doit être conservé."
  );

  assert(
    result.grade_actuel === 2,
    "Le nouveau grade doit être 2."
  );
}

// 2. Promotion valide G5 → G6
{
  const result = prepareGradeUpdate({
    commercialId: "commercial-5",
    currentGrade: 5,
    promotionRequest: {
      statut: "VALIDEE",
      ancienGrade: 5,
      nouveauGrade: 6,
    },
  });

  assert(
    result.grade_actuel === 6,
    "Le nouveau grade doit être 6."
  );
}

// 3. Une demande EN_ATTENTE ne peut pas modifier le grade
assertThrows(
  () =>
    prepareGradeUpdate({
      commercialId: "commercial-1",
      currentGrade: 1,
      promotionRequest: {
        statut: "EN_ATTENTE",
        ancienGrade: 1,
        nouveauGrade: 2,
      },
    }),
  "Seule une promotion validée"
);

// 4. Une demande REFUSEE ne peut pas modifier le grade
assertThrows(
  () =>
    prepareGradeUpdate({
      commercialId: "commercial-1",
      currentGrade: 1,
      promotionRequest: {
        statut: "REFUSEE",
        ancienGrade: 1,
        nouveauGrade: 2,
      },
    }),
  "Seule une promotion validée"
);

// 5. L'ancien grade doit correspondre au grade actuel
assertThrows(
  () =>
    prepareGradeUpdate({
      commercialId: "commercial-1",
      currentGrade: 2,
      promotionRequest: {
        statut: "VALIDEE",
        ancienGrade: 1,
        nouveauGrade: 2,
      },
    }),
  "ne correspond pas au grade actuel"
);

// 6. Impossible de sauter un grade
assertThrows(
  () =>
    prepareGradeUpdate({
      commercialId: "commercial-1",
      currentGrade: 1,
      promotionRequest: {
        statut: "VALIDEE",
        ancienGrade: 1,
        nouveauGrade: 3,
      },
    }),
  "exactement le grade suivant"
);

// 7. Impossible de passer de G6 à G7
assertThrows(
  () =>
    prepareGradeUpdate({
      commercialId: "commercial-1",
      currentGrade: 6,
      promotionRequest: {
        statut: "VALIDEE",
        ancienGrade: 6,
        nouveauGrade: 7,
      },
    }),
"grade maximal autorisé"
);

// 8. Identifiant commercial obligatoire
assertThrows(
  () =>
    prepareGradeUpdate({
      commercialId: "",
      currentGrade: 1,
      promotionRequest: {
        statut: "VALIDEE",
        ancienGrade: 1,
        nouveauGrade: 2,
      },
    }),
  "L'identifiant du commercial est obligatoire"
);

console.log(
  "Tous les tests du Grade Persistence Engine 5.8.3 sont passés."
);