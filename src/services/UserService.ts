import { AppDataSource } from '../database/index.js';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { User } from '../database/entities/User.js';
import { CreateUserDTO } from '../dtos/users/CreateUserDTO.js';

export class UserService {
    private userRepository: Repository<User>;

    constructor(userRepository?: Repository<User>) {
        this.userRepository = userRepository || AppDataSource.getRepository(User);
    }

    async create(userData: CreateUserDTO): Promise<User> {
        const userDto = plainToInstance(CreateUserDTO, userData);
        const errors = await validate(userDto);
        if (errors.length > 0) {
            const errorMessages = errors.map(err => Object.values(err.constraints || {})).flat();
            throw new Error(`Dados do usuário inválidos: ${errorMessages.join(', ')}`);
        }

        const existingUser = await this.userRepository.findOneBy({ email: userData.email });
        if (existingUser) {
            throw new Error('Já existe um usuário com este email.');
        }

        const user = this.userRepository.create(userData);
        return await this.userRepository.save(user);
    }

    async findById(id: string): Promise<User | null> {
        return this.userRepository.findOneBy({ id });
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async update(id: string, userData: Partial<CreateUserDTO>): Promise<User | null> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) return null;

        this.userRepository.merge(user, userData);
        return await this.userRepository.save(user);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.userRepository.delete(id);
        return !!result.affected && result.affected > 0;
    }
}

// Instância padrão exportada
export const userService = new UserService();
