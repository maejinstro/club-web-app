import { Controller, Post, Body, HttpStatus, HttpCode, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import type { Request as ExpressRequest } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
        constructor(private readonly authService: AuthService) { }

        @ApiOperation({ summary: 'Connexion utilisateur et obtention du JWT' })
        @ApiResponse({ status: 200, description: 'Connexion réussie, retourne le token.' })
        @ApiResponse({ status: 401, description: 'Identifiants invalides.' })
        @HttpCode(HttpStatus.OK)
        @Post('login')
        async login(@Body() loginDto: LoginDto) {
                return this.authService.login(loginDto);
        }

        @ApiBearerAuth('JWT-auth')
        @ApiOperation({ summary: 'Récupérer le profil de l’utilisateur connecté' })
        @ApiResponse({ status: 200, description: 'Profil récupéré avec succès.' })
        @ApiResponse({ status: 401, description: 'Token absent, invalide ou utilisateur supprimé.' })
        @UseGuards(JwtAuthGuard)
        @Get('me')
        async getProfile(@Request() req: ExpressRequest & { user: any }) {
                // Récupération de l'identifiant depuis le JWT (sub ou idUser)
                const userId = req.user.idUser || req.user.sub;

                // Appel au service pour interroger PostgreSQL en temps réel
                return this.authService.getProfile(userId);
        }
}