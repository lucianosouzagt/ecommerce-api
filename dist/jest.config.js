"use strict";
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"], // Verifique este caminho
    testMatch: ["**/**/*.test.ts"], // Procura por arquivos .test.ts em qualquer subdiretório
    verbose: true, // Exibe mais detalhes durante a execução dos testes
    // Opcional: Configuração de coverage
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["json", "lcov", "text", "clover"],
    // Configurações para ignorar certos diretórios ou arquivos
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
    // Pode ser necessário configurar aliases de módulo se você usar
    // caminhos customizados em seu tsconfig.json (ex: "@entities": "./src/entities")
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // Exemplo se você usa @/ no seu código
    },
};
