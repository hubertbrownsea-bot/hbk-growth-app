const assert = require("assert");

const { getNetworkRate } = require("./network");
const { buildSponsorshipChain } = require("./networkChain");
const {
  calculateNetworkCommission,
} = require("./networkCommission");

// Chaîne : A -> B -> C -> D
const sponsors = {
  D: "C",
  C: "B",
  B: "A",
};

const getSponsor = (commercialId) =>
  sponsors[commercialId] || null;

// Vente réalisée par D
const sellerId = "D";
const paidDirectCommission = 15;

// A est G6
const grades = {
  A: 6,
  B: 5,
  C: 4,
};

// 1. Construire la chaîne
const chain = buildSponsorshipChain(sellerId, getSponsor);

assert.deepStrictEqual(chain, [
  { degree: 1, commercialId: "C" },
  { degree: 2, commercialId: "B" },
  { degree: 3, commercialId: "A" },
]);

// 2. Calculer les commissions réseau
const networkCommissions = chain.map(({ degree, commercialId }) => {
  const grade = grades[commercialId];
  const rate = getNetworkRate(grade, degree);

  const amount = calculateNetworkCommission(
    paidDirectCommission,
    rate
  );

  return {
    degree,
    commercialId,
    grade,
    rate,
    amount,
  };
});

// 3. Vérification des résultats
assert.deepStrictEqual(networkCommissions, [
  {
    degree: 1,
    commercialId: "C",
    grade: 4,
    rate: 0.05,
    amount: 0.75,
  },
  {
    degree: 2,
    commercialId: "B",
    grade: 5,
    rate: 0.03,
    amount: 0.45,
  },
  {
    degree: 3,
    commercialId: "A",
    grade: 6,
    rate: 0.03,
    amount: 0.45,
  },
]);

// Total réseau : 0,75 + 0,45 + 0,45 = 1,65 USD
const totalNetworkCommission = networkCommissions.reduce(
  (total, item) => total + item.amount,
  0
);

assert.strictEqual(
  Number(totalNetworkCommission.toFixed(2)),
  1.65
);

console.log(
  "Tous les tests d'intégration du Network Engine 4.4 sont passés."
);
console.log(
  `Commission directe du vendeur : ${paidDirectCommission.toFixed(2)} USD`
);
console.log(
  `Commission réseau totale : ${totalNetworkCommission.toFixed(2)} USD`
);