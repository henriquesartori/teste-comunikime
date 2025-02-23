import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("customers")
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'uuid' })
    uuid: string;

    @Column()
    name: string;

    @Column({ type: 'datetime2' })
    birthDate: Date;

    @Column()
    gender: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @CreateDateColumn({ type: 'datetime2' })
    created_at: Date;

    @UpdateDateColumn({ type: 'datetime2' })
    updated_at: Date;
}