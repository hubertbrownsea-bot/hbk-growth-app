const assert = require("assert");
const { buildSponsorshipChain } = require("./networkChain");

// Chaîne : A -> B -> C -> D
const sponsors = {
  D: "C",
  C: "B",
  B: "A",
};

const getSponsor = (commercialId) => sponsors[commercialId] || null;

// Vente de D :
// niveau 1 = C
// niveau 2 = B
// niveau 3 = A
const chain = buildSponsorshipChain("D", getSponsor);

assert.deepStrictEqual(chain, [
  { degree: 1, commercialId: "C" },
  { degree: 2, commercialId: "B" },
  { degree: 3, commercialId: "A" },
]);

// Chaîne plus courte : D -> C -> B
const shortSponsors = {
  D: "C",
  C: "B",
};

const shortChain = buildSponsorshipChain(
  "D",
  (commercialId) => shortSponsors[commercialId] || null
);

assert.deepStrictEqual(shortChain, [
  { degree: 1, commercialId: "C" },
  { degree: 2, commercialId: "B" },
]);

// Aucun parrain
assert.deepStrictEqual(
  buildSponsorshipChain("D", () => null),
  []
);

// Un commercial ne peut pas être son propre parrain
assert.throws(
  () => buildSponsorshipChain("A", () => "A"),
  /propre parrain/
);

// Identifiant du commercial obligatoire
assert.throws(
  () => buildSponsorshipChain("", getSponsor),
  /identifiant du commercial est obligatoire/
);

// Fonction de recherche du parrain obligatoire
assert.throws(
  () => buildSponsorshipChain("D", null),
  /fonction de recherche du parrain est obligatoire/
);

console.log("Tous les tests du Network Chain Engine 4.2 sont passés.");