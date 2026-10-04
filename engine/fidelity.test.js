const { getFidelityCoefficient } = require("./fidelity");

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(
      `${message} | attendu: ${expected}, obtenu: ${actual}`
    );
  }
}

// Tests réglementaires
assertEqual(
  getFidelityCoefficient(1),
  1.00,
  "1er service"
);

assertEqual(
  getFidelityCoefficient(2),
  1.25,
  "2e service"
);

assertEqual(
  getFidelityCoefficient(3),
  1.50,
  "3e service"
);

assertEqual(
  getFidelityCoefficient(4),
  1.75,
  "4e service"
);

assertEqual(
  getFidelityCoefficient(5),
  1.75,
  "5e service"
);

assertEqual(
  getFidelityCoefficient(10),
  1.75,
  "10e service"
);

// Tests d'erreur
let errorDetected = false;

try {
  getFidelityCoefficient(0);
} catch (error) {
  errorDetected = true;
}

assertEqual(
  errorDetected,
  true,
  "0 service doit provoquer une erreur"
);

errorDetected = false;

try {
  getFidelityCoefficient(1.5);
} catch (error) {
  errorDetected = true;
}

assertEqual(
  errorDetected,
  true,
  "Un nombre non entier doit provoquer une erreur"
);

console.log("✓ Fidelity Engine : tous les tests sont réussis.");
