/**
 * HBK Growth Engine
 * Network Engine
 *
 * Phase 4.2 — Construction de la chaîne de parrainage
 *
 * Exemple :
 * A parraine B
 * B parraine C
 * C parraine D
 *
 * Pour une vente de D :
 * niveau 1 = C
 * niveau 2 = B
 * niveau 3 = A
 */

function buildSponsorshipChain(commercialId, getSponsor) {
  if (
    typeof commercialId !== "string" ||
    commercialId.trim() === ""
  ) {
    throw new Error("L'identifiant du commercial est obligatoire.");
  }

  if (typeof getSponsor !== "function") {
    throw new Error("La fonction de recherche du parrain est obligatoire.");
  }

  const chain = [];
  let currentCommercialId = commercialId;

  for (let degree = 1; degree <= 3; degree += 1) {
    const sponsorId = getSponsor(currentCommercialId);

    if (!sponsorId) {
      break;
    }

    if (
      typeof sponsorId !== "string" ||
      sponsorId.trim() === ""
    ) {
      throw new Error("L'identifiant du parrain est invalide.");
    }

    if (sponsorId === currentCommercialId) {
      throw new Error(
        "Un commercial ne peut pas être son propre parrain."
      );
    }

    chain.push({
      degree,
      commercialId: sponsorId,
    });

    currentCommercialId = sponsorId;
  }

  return chain;
}

module.exports = {
  buildSponsorshipChain,
};