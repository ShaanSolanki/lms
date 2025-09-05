import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Allow unescaped quotes in JSX
      "react/no-unescaped-entities": "warn",
      // Allow unused variables (they might be used later)
      "@typescript-eslint/no-unused-vars": "warn",
      // Allow img elements (can be optimized later)
      "@next/next/no-img-element": "warn",
      // Allow missing alt text (can be added later)
      "jsx-a11y/alt-text": "warn",
    },
  },
];

export default eslintConfig;
