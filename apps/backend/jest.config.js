module.exports = {
  preset: 'ts-jest/presets/default-esm',

  testEnvironment: 'node',

  rootDir: '.',

  moduleFileExtensions: ['ts', 'js', 'json'],

  testRegex: '.*\\.spec\\.ts$',

  extensionsToTreatAsEsm: ['.ts'],

  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './tsconfig.spec.json',
      },
    ],
  },

  transformIgnorePatterns: [
    'node_modules/(?!(\\@nestjs)/)',
  ],

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
