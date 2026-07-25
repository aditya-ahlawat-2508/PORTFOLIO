import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // react-hooks/immutability assumes React-owned values never mutate during
    // render. React Three Fiber's useFrame callback runs outside React's render
    // cycle (same category as an effect), and its entire idiom is imperatively
    // mutating the three.js scene graph there — material uniforms, camera
    // transforms, instanced-mesh matrices. That's not a violation of the rule's
    // intent, it's the wrong analysis target; disable for the scene subtree only.
    files: ["components/scene/**/*.{ts,tsx}", "lib/scene/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/immutability": "off",
    },
  },
]);

export default eslintConfig;
