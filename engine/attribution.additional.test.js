const assert = require("assert");

const {
  attributeAdditionalServiceSale,
} = require("./attribution");

// ============================================================
// CAS 1 : service supplémentaire vendu par un autre commercial
// ============================================================

const attribution = attributeAdditionalServiceSale({
  originCommercialId: "commercial-001",
  concludingCommercialId: "commercial-002",
  amountCommission: 20,
  justification: "Le commercial 002 a conclu le deuxième service.",
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
  justification: "Le commercial 002 a conclu le deuxième service.",
});

console.log(
  "✓ Service supplémentaire → commission 50/50, 0 GP, aucun nouveau client."
);

// ============================================================
// CAS 2 : même commercial interdit
// ============================================================

assert.throws(
  () =>
    attributeAdditionalServiceSale({
      originCommercialId: "commercial-001",
      concludingCommercialId: "commercial-001",
      amountCommission: 20,
      justification: "Test",
    }),
  /deux commerciaux différents/
);

console.log(
  "✓ Même commercial → attribution supplémentaire refusée."
);

// ============================================================
// CAS 3 : justification obligatoire
// ============================================================

assert.throws(
  () =>
    attributeAdditionalServiceSale({
      originCommercialId: "commercial-001",
      concludingCommercialId: "commercial-002",
      amountCommission: 20,
      justification: "",
    }),
  /justification.*obligatoire/
);

console.log(
  "✓ Justification absente → attribution supplémentaire refusée."
);

// ============================================================
// CAS 4 : conservation exacte de la commission avec arrondi
// ============================================================

const rounded = attributeAdditionalServiceSale({
  originCommercialId: "commercial-001",
  concludingCommercialId: "commercial-002",
  amountCommission: 15.01,
  justification: "Test de conservation du montant total.",
});

assert.strictEqual(
  Number(
    (
      rounded.originCommissionAmount +
      rounded.concludingCommissionAmount
    ).toFixed(2)
  ),
  15.01
);

console.log(
  "✓ Arrondi → le montant total de commission est conservé exactement."
);

console.log(
  "✓ Attribution Engine : tests de service supplémentaire réussis."
);
