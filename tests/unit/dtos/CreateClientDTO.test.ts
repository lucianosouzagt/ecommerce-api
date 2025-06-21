// tests/unit/dtos/CreateClientDTO.test.ts
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateClientDTO } from '../../../src/dtos/clients/CreateClientsDTO'; // Ajuste o caminho

describe('CreateClientDTO', () => {
    // Teste 1: Falha ao criar cliente sem nome (Campo obrigatório)
    it('should fail validation if name is missing', async () => {
        // 1. Prepare os dados inválidos (Red Phase)
        const invalidData = {
            email: 'test@example.com',
            phone: '123456789',
        };

        // 2. Transforme os dados em instância do DTO
        const dto = plainToInstance(CreateClientDTO, invalidData);

        // 3. Valide a instância
        const errors = await validate(dto);

        // 4. Afirme que deve haver erros de validação
        expect(errors.length).toBeGreaterThan(0);
        // Opcional: Verificar a mensagem de erro para 'name'
         expect(errors[0].property).toBe('name');
    });

    // Teste 2: Deve passar a validação com dados válidos
     it('should pass validation with valid data', async () => {
         const validData = {
             name: 'Valid Client',
             email: 'valid@example.com',
             phone: '987654321',
         };

         const dto = plainToInstance(CreateClientDTO, validData);
         const errors = await validate(dto);

         expect(errors.length).toBe(0); // Deve passar sem erros
     });

    // Teste 3: Deve falhar com email inválido
     it('should fail validation with an invalid email format', async () => {
         const invalidData = {
             name: 'Test Client',
             email: 'invalid-email', // Email inválido
             phone: '123456789',
         };

         const dto = plainToInstance(CreateClientDTO, invalidData);
         const errors = await validate(dto);

         expect(errors.length).toBeGreaterThan(0);
         expect(errors.some(error => error.property === 'email')).toBe(true); // Verifica se há erro na propriedade email
     });

     // Adicione mais testes para outras regras de validação (length, optional, etc.)
});