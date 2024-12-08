import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './auth.controller';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const user = await this.usersService.create(registerDto);
      const payload = { 
        sub: user.id,
        userId: user.userId,
        email: user.email 
      };
      
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          userId: user.userId,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      if (error.code === '23505') { // PostgreSQL unique violation code
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async validateUser(email: string, password: string) {
    console.log('Validating user with email:', email);
    const user = await this.usersService.validateUser(email, password);
    console.log('Validation result:', user ? 'User found' : 'Invalid credentials');
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(email: string, password: string) {
    console.log('Login attempt for email:', email);
    const user = await this.validateUser(email, password);
    
    const payload = { 
      sub: user.id,
      userId: user.userId,
      email: user.email 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        userId: user.userId,
        name: user.name,
        email: user.email,
      },
    };
  }
}
