import { BadRequestException, Controller, Post, Get, Body, UnauthorizedException, Res, HttpStatus, Req } from '@nestjs/common';
import { AuthService } from './auth.sevice'
import { CreateUserDto } from './dto/create-user.dto';

import { Tokens } from './interface'
import { Request, Response } from 'express';
import { UserAgent } from 'src/decorators/user-agent.decorator';
import { Cookie } from 'src/decorators/cookie.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('sign-up')
  async sign_up(@Body() dto: CreateUserDto) {
    const user = await this.authService.sign_up(dto)
    if (!user) {
      throw new BadRequestException(`Не получается зарегестрировать пользователя ${JSON.stringify(dto)}`)
    }
    return user
  }


  @Post('sign-in')
  async sign_in(@Body() dto: CreateUserDto, @UserAgent() userAgent: string, @Res() res: Response) {

    const tokens = await this.authService.sign_in(dto, userAgent)
    if (!tokens) {
      throw new BadRequestException(`Не получается войти с данными ${JSON.stringify(dto)}`)
    }

    this.setRefreshTokenToCookie(tokens, res)
  }

  // @Post('sign-out')
  // async sign_out(@Req() req: Request) {

  // }

  @Get('refresh-token')
  async refreshToken(@Req() req: Request, @Cookie('refreshToken') refreshToken: string, res: Response, @UserAgent() userAgent: string) {

    if (!refreshToken) {
      throw new UnauthorizedException()
    }

    const tokens = await this.authService.refreshTokens(refreshToken, userAgent)
    if (!tokens) {
      throw new UnauthorizedException()
    }

    this.setRefreshTokenToCookie(tokens, res)
  }

  private setRefreshTokenToCookie(tokens: Tokens, response: Response) {
    if (!tokens) {
      throw new UnauthorizedException('Нет токенов')
    }

    response.cookie('refreshToken', tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(tokens.refreshToken.exp),
      secure: false, // для продакшена true
      path: '/'
    })

    response.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken })
  }
}
