import { User } from 'src/modules/users/entity/user.entity';
import { Entity, Column, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('token')
export class Token {
    @PrimaryColumn()
    token: string;

    @Column({ nullable: true })
    exp: Date;

    @Column({ nullable: false })
    userFK: number

    @Column({ nullable: false })
    userAgent: string

    @OneToOne(() => User, user => user.token)
    user: User;
}