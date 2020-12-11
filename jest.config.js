module.exports = {
    collectCoverage: true,
    transform: { '\\.js$': 'babel-jest', },
    "coverageThreshold": {
        "global": {
            "statements": 65,
            "branches": 60,
            "functions": 60,
            "lines": 60
        }
    },
    runner: "jest-runner-eslint",
    verbose: true
};