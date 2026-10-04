const assert = require("assert");

const { attributeNormalSale } = require("./attribution");

// ============================================================
// CAS 1 : vente normale
// ============================================================

const attribution = attributeNormalSale({
  originCommercialId: "commercial-001",
  amountCommission: 15,
  gpGenerated: 20,
});

assert.deepStrictEqual(attribution, {
  originCommercialId: "commercial-001",
  concludingCommercialId: "commercial-001",
  commissionShare: 100,
  commissionAmount: 15,
  gpAttributed: 20,
  countsForPromotion: true,
});

console.log(
  "✓ Vente normale → 100 % commission, 100 % GP, client comptabilisé."
);

// ============================================================
// CAS 2 : commercial d'origine obligatoire
// ============================================================

assert.throws(
  () =>
    attributeNormalSale({
      originCommercialId: "",
      amountCommission: 15,
      gpGenerated: 20,
    }),
  /commercial d'origine est obligatoire/
);

console.log(
  "✓ Commercial d'origine absent → attribution refusée."
);

// ============================================================
// CAS 3 : valeurs négatives interdites
// ============================================================

assert.throws(
  () =>
    attributeNormalSale({
      originCommercialId: "commercial-001",
      amountCommission: -1,
      gpGenerated: 20,
    }),
  /montant de commission/
);

assert.throws(
  () =>
    attributeNormalSale({
      originCommercialId: "commercial-001",
      amountCommission: 15,
      gpGenerated: -1,
    }),
  /nombre de GP générés/
);

console.log(
  "✓ Commission et GP négatifs → attribution refusée."
);

console.log(
  "✓ Attribution Engine : tests de vente normale réussis."
);
