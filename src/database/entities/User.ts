import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string; // Asserção de atribuição definitiva

    @Column({ type: "varchar", length: 255, nullable: false })
    name!: string; // Asserção (ou inicializar na criação)

    @Column({ type: "varchar", length: 255, unique: true, nullable: false })
    email!: string; // Asserção (ou inicializar na criação)

    @Column({ type: "timestamp", nullable: true })
    email_verified_at: Date | null = null; // Inicializado com null

    @Column({ type: "varchar", length: 255, nullable: false })
    password!: string; // Asserção (ou inicializar na criação)

    @Column({ type: "varchar", length: 255, nullable: false })
    salt!: string; // Asserção (ou inicializar na criação)

    @CreateDateColumn()
    created_at!: Date; // Asserção de atribuição definitiva (gerenciada pelo TypeORM)

    @UpdateDateColumn()
    updated_at!: Date; // Asserção de atribuição definitiva (gerenciada pelo TypeORM)

    @Column({ type: "uuid", nullable: true })
    updated_by: string | null = null; // Inicializado com null

    // Relacionamentos e outros campos, se houver
}