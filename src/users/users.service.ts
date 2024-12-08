import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'userId', 'name', 'email', 'createdAt', 'updatedAt']
    });
  }

  async findOne(id: string): Promise<User | null> {
    console.log('Finding user with id:', id);
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'userId', 'name', 'email', 'createdAt', 'updatedAt']
    });
    console.log('Found user:', user);
    return user;
  }

  findByUserId(userId: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { userId },
      select: ['id', 'userId', 'name', 'email', 'createdAt', 'updatedAt']
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    if (!userData.password) {
      throw new BadRequestException('Password is required');
    }
    
    const user = this.usersRepository.create(userData);
    user.password = await bcrypt.hash(userData.password, 10);
    const savedUser = await this.usersRepository.save(user);
    
    // Remove password from response
    delete savedUser.password;
    return savedUser;
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const user = await this.findOne(id);
    if (!user) {
      return null;
    }

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    await this.usersRepository.update(id, userData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    console.log('Users service validateUser:', { email });
    const user = await this.usersRepository.findOne({ 
      where: { email },
      select: ['id', 'userId', 'name', 'email', 'password', 'createdAt', 'updatedAt']
    });

    if (!user) {
      console.log('User not found');
      return null;
    }

    console.log('Found user:', user.email);
    console.log('Comparing passwords...');
    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isValid);

    if (isValid) {
      delete user.password;
      return user;
    }

    return null;
  }
}
