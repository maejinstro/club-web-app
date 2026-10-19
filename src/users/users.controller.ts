import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Req, ForbiddenException } from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createUserDto: CreateUserDto,
    @Req() request: Request) {
    if (request.user?.role !== 'admin')
      throw new ForbiddenException("non autorisé");

    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Req() request: Request) {
    if (request.user?.role !== 'admin')
      throw new ForbiddenException("non autorisé");
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request) {
    if ((request.user?.role !== 'admin') && (request.user?.sub !== id))
      throw new ForbiddenException("non autorisé");

    return this.usersService.findOne(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request) {
    if (request.user?.role !== 'admin')
      throw new ForbiddenException("non autorisé");

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request) {
    if (request.user?.role !== 'admin')
      throw new ForbiddenException("non autorisé");

    return this.usersService.remove(id);
  }
}
