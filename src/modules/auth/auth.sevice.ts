import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entity/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import * as argon2 from 'argon2';
import { Token } from './entity/token.entity';
import { v4 } from 'uuid'
import { add } from 'date-fns/add';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Tokens } from './interface'

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
        @InjectRepository(Token) private readonly tokenRepository: Repository<Token>
    ) { }

    public async refreshTokens(refreshToken: string, userAgent: string) {
        const token: Token = await this.tokenRepository.findOne({ where: { token: refreshToken } })

        if (!token) {
            throw new UnauthorizedException()
        }

        if (new Date(token.exp) < new Date()) {
            await this.tokenRepository.delete({ token: token.token })
            throw new UnauthorizedException()
        }

        await this.tokenRepository.delete({ token: token.token })
        const user = await this.usersService.findOne(token.userFK)

        return await this.generateTokens(user, userAgent)
    }

    public async sign_in(data: CreateUserDto, userAgent: string): Promise<Tokens> {
        const user: User = await this.usersService.findOne(data.email)

        if (!user || !await argon2.verify(user.password, data.password)) {
            throw new UnauthorizedException("Неверный логин или пароль")
        }

        return await this.generateTokens(user, userAgent);
    }

    public async sign_up(data: CreateUserDto) {
        const user: User = await this.usersService.findOne(data.email)

        if (user) {
            throw new ConflictException("Пользователь с таким email уже зарегистрирован")
        }
        return await this.usersService.save(data)
    }

    // public async sign_out(tokens: Tokens) {
    //     const token: Token = await this.tokenRepository.findOne({ where: { token: tokens.refreshToken } })
    //     if (!token) {
    //         throw new UnauthorizedException()
    //     }
    //     await this.tokenRepository.delete({ token: token.token })
    // }

    private async generateTokens(user: User, userAgent: string): Promise<Tokens> {
        const payload = {
            id: user.id,
            email: user.email,
            roles: user.roles,
        }

        const accessToken = 'Bearer ' + await this.jwtService.signAsync(payload)
        const refreshToken = await this.getRefreshToken(user, userAgent)
        return { accessToken, refreshToken }
    }

    private async getRefreshToken(dto: User, userAgent: string) {
        const token = await this.tokenRepository.findOne({
            where: {
                userAgent: userAgent,
                userFK: dto.id
            }
        })

        if (token) {
            throw new UnauthorizedException()
        }

        return this.tokenRepository.save({
            token: v4(),
            exp: add(new Date, { months: 1 }),
            userFK: dto.id,
            userAgent: userAgent || ''
        })
    }
}