const assert = require("assert");

const { attributeSharedSale } = require("./attribution");

// ============================================================
// CAS 1 : vente partagée valide
// ============================================================

const attribution = attributeSharedSale({
  originCommercialId: "commercial-001",
  concludingCommercialId: "commercial-002",
  amountCommission: 20,
});

assert.deepStrictEqual(attribution, {
  originCommercialId: "commercial-001",
  concludingCommercialId: "commercial-002",
  commissionShare: 50,
  originCommissionAmount: 10,
  concludingCommissionAmount: 10,
  originGpAttributed: 0,
  concludingGpAttributed: 0,
  originCountsForPromotion: false,
  concludingCountsForPromotion: false,
});

console.log(
  "✓ Vente partagée → commission 50/50, 0 GP, aucun client comptabilisé."
);

// ============================================================
// CAS 2 : même commercial interdit
// ============================================================

assert.throws(
  () =>
    attributeSharedSale({
      originCommercialId: "commercial-001",
      concludingCommercialId: "commercial-001",
      amountCommission: 20,
    }),
  /deux commerciaux différents/
);

console.log(
  "✓ Même commercial → vente partagée refusée."
);

// ============================================================
// CAS 3 : commercial concluant obligatoire
// ============================================================

assert.throws(
  () =>
    attributeSharedSale({
      originCommercialId: "commercial-001",
      concludingCommercialId: "",
      amountCommission: 20,
    }),
  /commercial concluant est obligatoire/
);

console.log(
  "✓ Commercial concluant absent → vente partagée refusée."
);

console.log(
  "✓ Attribution Engine : tests de vente partagée réussis."
);
