import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../entities/Users.js';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    private async generateToken(user: Users) {

        const payload = {
            sub: user.idUser,
            idUser: user.idUser, // Ajouté pour correspondre à ton attente d'identifiant
            email: user.email,
            username: user.username,
            role: user.role,     // Ajouté pour que le JWT porte le rôle de l'utilisateur
        };

        return this.jwtService.signAsync(payload);
    }

    async register(RegisterDto: RegisterDto) {

        const user = await this.usersService.create({
            email: RegisterDto.email,
            username: RegisterDto.username,
            password: RegisterDto.password,
        });

        const token = await this.generateToken(user);

        return {
            user: {
                idUser: user.idUser,
                username: user.username,
                role: user.role, // Ajouté pour renvoyer le rôle lors de l'enregistrement
            },
            accessToken: token,
        };
    }

    async login(LoginDto: LoginDto) {

        const user = await this.usersService.findByUsername(LoginDto.username);
        if (!user || !(await bcrypt.compare(LoginDto.password, user.passwordHash))) {
            throw new UnauthorizedException('Identifiants invalides.');
        }

        const token = await this.generateToken(user);

        return {
            user: {
                idUser: user.idUser,
                username: user.username,
                role: user.role, // Ajouté pour renvoyer le rôle lors du login
            },
            accessToken: token,
        };
    }

    // Ajoute cette méthode dans ta classe AuthService existante :

    async getProfile(userId: number) {
        const user = await this.usersService.findById(userId);
        
        if (!user) {
            throw new UnauthorizedException('Utilisateur introuvable ou supprimé.');
        }

        return {
            idUser: user.idUser,
            username: user.username,
            role: user.role, // Source directe PostgreSQL, non figée dans le vieux JWT
        };
    }
}