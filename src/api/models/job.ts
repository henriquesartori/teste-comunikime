import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("jobs")
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    job_id: number;

    @Column()
    name: string;

    @Column()
    status: string;

    @Column({ nullable: true })
    error: string;

    @CreateDateColumn({ type: 'datetime2' })
    created_at: Date;

    @UpdateDateColumn({ type: 'datetime2' })
    updated_at: Date;
}