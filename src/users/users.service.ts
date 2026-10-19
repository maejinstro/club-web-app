import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Users } from '../entities/Users.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>) { }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { idUser: id } });

    if (!user) {
      throw new NotFoundException(`Utilisateur ${id} introuvable`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const existingEmail = await this.usersRepository.findOne({
      where: { email: createUserDto.email }
    });
    if (existingEmail) { throw new ConflictException('Email déjà utilisé') };

    const existingUsername = await this.usersRepository.findOne({
      where: { username: createUserDto.username }
    });
    if (existingUsername) { throw new ConflictException('Username déjà utilisé'); }

    const passwordHash = await bcrypt.hash(createUserDto.password, 12);

    const user = this.usersRepository.create({
      email: createUserDto.email,
      passwordHash,
      username: createUserDto.username,
      position: createUserDto.position ?? null,
      role: 'player'
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findById(idUser: number) {
    return this.usersRepository.findOne({
      where: {
        idUser,
      },
    });
  }

  async findByUsername(username: string) {
    return this.usersRepository.findOne({
      where: {
        username,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto,) {
    const user = await this.findOne(id); // Réutilise findOne qui gère déjà l'erreur 404

    if (updateUserDto.email) {
      const existingEmail = await this.usersRepository.findOne(
        { where: { email: updateUserDto.email } }
      );

      if (existingEmail && existingEmail.idUser !== id) {
        throw new ConflictException('Email déjà utilisé');
      }
      user.email = updateUserDto.email;
    }

    if (updateUserDto.username) {
      const existingUsername =
        await this.usersRepository.findOne({
          where: { username: updateUserDto.username, },
        });

      if (existingUsername && existingUsername.idUser !== id) {
        throw new ConflictException('Username déjà utilisé');
      }

      user.username = updateUserDto.username;
    }

    if (updateUserDto.password) {
      user.passwordHash = await bcrypt.hash(updateUserDto.password, 12);
    }

    if (updateUserDto.firstName !== undefined) {
      user.firstName =
        updateUserDto.firstName ?? null;
    }

    if (updateUserDto.lastName !== undefined) {
      user.lastName =
        updateUserDto.lastName ?? null;
    }

    if (updateUserDto.birthdate !== undefined) {
      user.birthdate =
        updateUserDto.birthdate ?? null;
    }

    if (updateUserDto.phone !== undefined) {
      user.phone =
        updateUserDto.phone ?? null;
    }

    if (updateUserDto.position !== undefined) {
      user.position =
        updateUserDto.position ?? null;
    }

    return await this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    await this.usersRepository.remove(user);

    return { message: 'Utilisateur supprimé', idUser: id };
  }
}