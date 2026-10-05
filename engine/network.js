/**
 * HBK Growth Engine
 * Network Engine
 *
 * Phase 4.1 — Taux de commission réseau
 *
 * Règles officielles :
 *
 * G1-G3 :
 * - aucun droit à une commission réseau
 *
 * G4 :
 * - niveau 1 : 5 %
 *
 * G5 :
 * - niveau 1 : 8 %
 * - niveau 2 : 3 %
 *
 * G6 :
 * - niveau 1 : 10 %
 * - niveau 2 : 5 %
 * - niveau 3 : 3 %
 */

function getNetworkRate(grade, degree) {
  if (
    !Number.isInteger(grade) ||
    grade < 1 ||
    grade > 6
  ) {
    throw new Error(
      "Le grade doit être un entier compris entre 1 et 6."
    );
  }

  if (
    !Number.isInteger(degree) ||
    degree < 1 ||
    degree > 3
  ) {
    throw new Error(
      "Le niveau de réseau doit être un entier compris entre 1 et 3."
    );
  }

  if (grade < 4) {
    return 0;
  }

  if (grade === 4) {
    return degree === 1 ? 0.05 : 0;
  }

  if (grade === 5) {
    if (degree === 1) return 0.08;
    if (degree === 2) return 0.03;
    return 0;
  }

  if (grade === 6) {
    if (degree === 1) return 0.10;
    if (degree === 2) return 0.05;
    if (degree === 3) return 0.03;
  }

  return 0;
}

module.exports = {
  getNetworkRate,
};