const { calculateGP } = require("./gp");

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(
      `${message} | attendu: ${expected}, obtenu: ${actual}`
    );
  }
}

// 100 $ × coefficient 1.00
assertEqual(
  calculateGP(100, 1.00),
  20,
  "GP pour le 1er service"
);

// 100 $ × coefficient 1.25
assertEqual(
  calculateGP(100, 1.25),
  25,
  "GP pour le 2e service"
);

// 100 $ × coefficient 1.50
assertEqual(
  calculateGP(100, 1.50),
  30,
  "GP pour le 3e service"
);

// 100 $ × coefficient 1.75
assertEqual(
  calculateGP(100, 1.75),
  35,
  "GP pour le 4e service"
);

// 250 $ × coefficient 1.25
assertEqual(
  calculateGP(250, 1.25),
  62.50,
  "GP pour 250 $ avec coefficient 1.25"
);

// Validation des erreurs
let errorDetected = false;

try {
  calculateGP(0, 1.00);
} catch (error) {
  errorDetected = true;
}

assertEqual(
  errorDetected,
  true,
  "Un montant nul doit provoquer une erreur"
);

errorDetected = false;

try {
  calculateGP(100, 0);
} catch (error) {
  errorDetected = true;
}

assertEqual(
  errorDetected,
  true,
  "Un coefficient nul doit provoquer une erreur"
);

console.log("✓ GP Engine : tous les tests sont réussis.");
