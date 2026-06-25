import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/**
 * Flat config nativa di eslint-config-next (>=15).
 * Niente FlatCompat: su ESLint 9 il compat di @eslint/eslintrc va in crash
 * ("Converting circular structure to JSON") durante la validazione.
 */
/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "coverage/**",
      "next-env.d.ts",
    ],
  },
  ...coreWebVitals,
  ...typescript,
  {
    // Il codice applicativo deve restare pulito: `any` è un errore.
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    // Script di build/valutazione RAG (dev tooling, non spediti): qui `any`
    // sulle risposte LLM grezze è pragmatico e accettabile.
    files: ["scripts/**/*.mts", "scripts/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
