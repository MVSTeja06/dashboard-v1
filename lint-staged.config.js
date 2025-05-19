// lint-staged.config.ts
module.exports = {
  "*.{ts,tsx}": ["npm run lint", () => "tsc --noEmit"],
};
