const assert = require("assert");

const {
  preparePromotionRecord,
} = require("./promotionPersistence");

// ============================================================
// Demande validée → enregistrement compatible avec Supabase
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
  requestedAt: "2026-10-07T08:00:00.000Z",
  validatedAt: "2026-10-07T09:00:00.000Z",
});

assert.deepStrictEqual(record, {
  commercial_id: "commercial-001",
  ancien_grade: 1,
  nouveau_grade: 2,
  clients_valides: 7,
  gp_valides: 42,
  statut: "VALIDEE",
  motif: null,
  valide_par_commercial_id: "coordination-001",
  date_demande: "2026-10-07T08:00:00.000Z",
  date_validation: "2026-10-07T09:00:00.000Z",
});

// ============================================================
// Les dates sont optionnelles : Supabase peut utiliser ses
// valeurs par défaut pour date_demande.
// ============================================================

const recordWithoutDates = preparePromotionRecord({
  promotionRequest: {
    commercialId: "commercial-002",
    ancienGrade: 2,
    nouveauGrade: 3,
    clientsValides: 12,
    gpValides: 80,
    statut: "VALIDEE",
    validateurId: "coordination-001",
  },
});

assert.strictEqual(
  recordWithoutDates.date_demande,
  undefined
);

assert.strictEqual(
  recordWithoutDates.date_validation,
  undefined
);

// ============================================================
// Une demande EN_ATTENTE ne peut pas être persistée comme
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
        commercialId: "commercial-004",
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
        commercialId: "commercial-005",
        ancienGrade: 1,
        nouveauGrade: 3,
        clientsValides: 10,
        gpValides: 75,
        statut: "VALIDEE",
        validateurId: "coordination-001",
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
        validateurId: "coordination-001",
      },
    }),
  /identifiant du commercial/
);

// ============================================================
// Identifiant du validateur obligatoire
// ============================================================

assert.throws(
  () =>
    preparePromotionRecord({
      promotionRequest: {
        commercialId: "commercial-006",
        ancienGrade: 1,
        nouveauGrade: 2,
        clientsValides: 5,
        gpValides: 30,
        statut: "VALIDEE",
      },
    }),
  /identifiant du validateur/
);

console.log(
  "Tous les tests du Promotion Persistence Engine 5.8.1 sont passés."
);
