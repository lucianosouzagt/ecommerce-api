// jest.config.js
module.exports = {
    preset: 'ts-jest', // Usa ts-jest para lidar com arquivos TypeScript
    testEnvironment: 'node', // Define o ambiente de teste como Node.js
    testMatch: [
        "**/tests/**/**/*.test.ts" // Onde o Jest deve procurar seus arquivos de teste
    ],
    setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"], // Arquivo de setup global para mocks
    moduleNameMapper: {
    // Se você usa aliases no seu tsconfig.json (ex: '@/' para 'src/'), configure aqui
    // Exemplo: '^@/(.*)$': '<rootDir>/src/$1',
    },
    modulePaths: ["<rootDir>/src"], // Para resolver imports como "src/entities/Client"
};
export {};
