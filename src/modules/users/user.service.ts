import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import { CreateUserDto } from './dto/create-user.dto';

import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }

  public async save(user: CreateUserDto) {
    return await this.userRepository.save({
      email: user.email,
      password: await this.hashPassword(user.password),
      roles: ['USER']
    })
  }

  public async findOne(idOremail: string | number) {
    return typeof (idOremail) === 'string' ?
      await this.userRepository.findOne({
        where: {
          email: idOremail,
        },
      })
      :
      await this.userRepository.findOne({
        where: {
          id: idOremail,
        },
      })
  }

  public async delete(id: number) {
    return await this.userRepository.delete({
      id: id
    })
  }

  private async hashPassword(password: string) {
    return await argon2.hash(password);
  }
}
