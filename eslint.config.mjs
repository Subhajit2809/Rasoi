import nextConfig from "eslint-config-next/core-web-vitals";

export default [
  ...nextConfig,
  {
    rules: {
      // setState in useEffect is standard for data-fetching hooks
      "react-hooks/set-state-in-effect": "off",
      // Date.now() in render is fine for display-only freshness calculations
      "react-hooks/purity": "off",
    },
  },
];
