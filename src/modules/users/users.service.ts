import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities';
import { Repository } from 'typeorm';
import { SignUpDto } from '../auth/dto';

// This should be a real class/interface representing a user entity
export type User1 = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User1 | undefined> {
    return this.users.find((user) => user.username === username);
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepo.findOne({
        where: {
          email,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async createNewUser(signUpDto: SignUpDto): Promise<User> {
    try {
      const { email, password, firstName, lastName } = signUpDto;

      const createdUser = this.userRepo.create({
        email,
        password,
        firstName,
        lastName,
        dateJoined: new Date(),
      });
      await this.userRepo.save(createdUser);

      return createdUser;
    } catch (error) {
      throw error;
    }
  }
}
