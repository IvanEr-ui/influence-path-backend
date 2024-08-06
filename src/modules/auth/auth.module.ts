import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.sevice';
import { UserModule } from '../users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entity/token.entity';
import { JwtModule } from '@nestjs/jwt';
import { options } from './config/jwt-module-asyn-options';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync(options()),
    TypeOrmModule.forFeature([Token])
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule { }
