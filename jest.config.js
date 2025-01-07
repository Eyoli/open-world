/** @type {import('ts-jest').JestConfigWithTsJest} **/
const esModules = ['d3-polygon', 'd3-array', 'other-d3-module-if-needed'].join('|');
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
};