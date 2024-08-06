import { Token } from 'src/modules/auth/entity/token.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    username: string;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false, unique: true })
    password: string;

    @Column('simple-array', { nullable: false })
    roles: string[];

    @OneToOne(() => Token, token => token.user, { cascade: true })
    token: Token;
}