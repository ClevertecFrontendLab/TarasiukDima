export default {
    clearMocks: true,
    rootDir: './',
    preset: 'ts-jest',
    testEnvironment: "jsdom",
    coveragePathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/"],
    moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
    roots: ["<rootDir>src"],
    moduleDirectories: ["<rootDir>src", "node_modules"],
    modulePaths: ["<rootDir>src"],
    testMatch: ["<rootDir>src/**/*(*.)@(spec|test).[tj]s?(x)"],
    moduleNameMapper: {
        "^@constants/(.*)$": "<rootDir>/src/constants/$1",
    },
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
};
