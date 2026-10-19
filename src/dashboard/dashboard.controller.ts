import { Controller, Get, Query, UseGuards, Req, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import type { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Valide que le paramètre seasonId est renseigné, représente un nombre valide,
   * est un entier et est strictement supérieur à 0.
   */
  private validateSeasonId(seasonIdRaw?: string): number {
    if (!seasonIdRaw) {
      throw new BadRequestException("L'identifiant de saison (seasonId) est requis.");
    }

    const seasonId = Number(seasonIdRaw);

    if (isNaN(seasonId) || !Number.isInteger(seasonId) || seasonId <= 0) {
      throw new BadRequestException("L'identifiant de saison (seasonId) doit être un entier strictement positif.");
    }

    return seasonId;
  }

  @Get('team')
  async getTeamStats(@Query('seasonId') seasonIdRaw: string) {
    const seasonId = this.validateSeasonId(seasonIdRaw);
    return this.dashboardService.getTeamStats(seasonId);
  }

  @Get('me')
  async getMyStats(@Query('seasonId') seasonIdRaw: string, @Req() req: Request) {
    const seasonId = this.validateSeasonId(seasonIdRaw);

    // Récupération de l'identifiant 'sub' injecté de manière sécurisée par JwtAuthGuard
    const userId = req.user?.sub;

    if (!userId || typeof userId !== 'number' || !Number.isSafeInteger(userId) || userId <= 0) {
      throw new UnauthorizedException("Identifiant utilisateur invalide dans le token d'authentification.");
    }

    // L'identifiant sécurisé 'userId' est transmis directement au service
    return this.dashboardService.getPlayerStats(userId, seasonId);
  }
}