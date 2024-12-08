import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, UnauthorizedException, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  name: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;
}

@Controller('users')
// @UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req): Promise<User> {
    const user = await this.usersService.findOne(req.user.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    console.log('id', id)
    const user = await this.usersService.findOne(id);
    return user;
  }

  @Get('by-uuid/:userId')
  findByUserId(@Param('userId') userId: string): Promise<User | null> {
    return this.usersService.findByUserId(userId);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ): Promise<User | null> {
    // Only allow users to update their own profile
    if (req.user.sub !== id) {
      throw new UnauthorizedException();
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req): Promise<void> {
    // Only allow users to delete their own profile
    if (req.user.sub !== id) {
      throw new UnauthorizedException();
    }
    return this.usersService.remove(id);
  }
}
