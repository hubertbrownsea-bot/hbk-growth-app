const assert = require("assert");

const {
  preparePromotionRecord,
} = require("./promotionPersistence");

// ============================================================
// Demande validée → enregistrement prêt pour persistance
// ============================================================

const record = preparePromotionRecord({
  promotionRequest: {
    commercialId: "commercial-001",
    ancienGrade: 1,
    nouveauGrade: 2,
    clientsValides: 7,
    gpValides: 42,
    statut: "VALIDEE",
    motif: null,
    validateurId: "coordination-001",
  },
  createdAt: "2026-10-07T08:00:00.000Z",
});

assert.deepStrictEqual(record, {
  commercial_id: "commercial-001",
  ancien_grade: 1,
  nouveau_grade: 2,
  clients_valides: 7,
  gp_valides: 42,
  statut: "VALIDEE",
  motif: null,
  validateur: "coordination-001",
  date_creation: "2026-10-07T08:00:00.000Z",
});

// ============================================================
// Une demande EN_ATTENTE ne peut pas être persistée comme
// promotion validée
// ============================================================

assert.throws(
  () =>
    preparePromotionRecord({
      promotionRequest: {
        commercialId: "commercial-002",
        ancienGrade: 1,
        nouveauGrade: 2,
        clientsValides: 5,
        gpValides: 30,
        statut: "EN_ATTENTE",
      },
    }),
  /promotion validée/
);

// ============================================================
// Une demande REFUSEE ne peut pas être persistée comme
// promotion validée
// ============================================================

assert.throws(
  () =>
    preparePromotionRecord({
      promotionRequest: {
        commercialId: "commercial-003",
        ancienGrade: 1,
        nouveauGrade: 2,
        clientsValides: 5,
        gpValides: 30,
        statut: "REFUSEE",
      },
    }),
  /promotion validée/
);

// ============================================================
// Saut de grade interdit
// ============================================================

assert.throws(
  () =>
    preparePromotionRecord({
      promotionRequest: {
        commercialId: "commercial-004",
        ancienGrade: 1,
        nouveauGrade: 3,
        clientsValides: 10,
        gpValides: 75,
        statut: "VALIDEE",
      },
    }),
  /grade immédiatement supérieur/
);

// ============================================================
// Identifiant commercial obligatoire
// ============================================================

assert.throws(
  () =>
    preparePromotionRecord({
      promotionRequest: {
        commercialId: "",
        ancienGrade: 1,
        nouveauGrade: 2,
        clientsValides: 5,
        gpValides: 30,
        statut: "VALIDEE",
      },
    }),
  /identifiant du commercial/
);

// ============================================================
// Date optionnelle
// ============================================================

const recordWithoutDate = preparePromotionRecord({
  promotionRequest: {
    commercialId: "commercial-005",
    ancienGrade: 2,
    nouveauGrade: 3,
    clientsValides: 10,
    gpValides: 75,
    statut: "VALIDEE",
  },
});

assert.strictEqual(
  recordWithoutDate.date_creation,
  undefined
);

console.log(
  "Tous les tests du Promotion Persistence Engine 5.7 sont passés."
);