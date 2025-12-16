module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/mlab5/src'], // Specify where Jest should look for test files
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};
