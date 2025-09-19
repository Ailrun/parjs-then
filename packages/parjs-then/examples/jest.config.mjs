import common from "../../../jest.root.mjs";

/** @type {import("jest").Config} */
const config = {
    rootDir: ".",
    setupFilesAfterEnv: ["<rootDir>/../spec/utilities/index.ts"],
    ...common,
    moduleNameMapper: {
        "^@lib/(.*)$": "<rootDir>/../dist/$1",
        "^@lib$": "<rootDir>/../dist",
        "^@examples/(.*)$": "<rootDir>/src/$1",
        "^@examples$": "<rootDir>/src"
    }
};

export default config;
