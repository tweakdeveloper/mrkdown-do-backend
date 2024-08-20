import { type JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  roots: ['<rootDir>/src/', '<rootDir>/tests/'],
  testEnvironment: 'node',
  transform: {
    '^.+.ts$': ['ts-jest', { useESM: true }],
  },
};

export default config;
