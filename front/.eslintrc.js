/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["next/core-web-vitals"],
  rules: {
    // App Router only — no pages/ directory; rule expects pagesDir and crashes
    "@next/next/no-html-link-for-pages": "off",
    "@next/next/no-img-element": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "react/no-unescaped-entities": "off",
  },
  ignorePatterns: [".next/", "node_modules/", "coverage/"],
}
