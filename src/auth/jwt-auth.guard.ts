import {
  CanActivate,           // Contrat d'un Guard NestJS
  ExecutionContext,      // Accès au contexte de la requête
  Injectable,            // Autorise l'injection de dépendances
  NotFoundException,     // Erreur 404 produite par UsersService
  UnauthorizedException, // Erreur HTTP 401
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type { Users } from '../entities/Users.js';
import { UsersService } from '../users/users.service.js';
import './types.js'; // Extension du type Express Request

@Injectable()

export class JwtAuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>(); // Récupérer la requête HTTP
    const token = this.extractTokenFromHeader(request); // Extraire le JWT de l'en-tête Authorization

    if (!token) {throw new UnauthorizedException('Token manquant');} // Refuser toute requête sans token

    let payload: unknown // Le contenu JWT n'est pas encore considéré fiable

    // Vérifier la signature et l'expiration du JWT
    try { payload = await this.jwtService.verifyAsync(token); } 
    catch { throw new UnauthorizedException('Token invalide ou expiré'); }

    // Vérifier la structure et le type de sub
    if (typeof payload !== 'object' || payload === null || !('sub' in payload) || typeof payload.sub !== 'number' || !Number.isSafeInteger(payload.sub) || payload.sub <= 0)
      { throw new UnauthorizedException( 'Identifiant utilisateur invalide dans le token' );}

    let user // 7. Préparer le résultat de la recherche

    // Rechercher le compte actuel dans PostgreSQL
    try {user = await this.usersService.findOne(payload.sub);} 
    catch (error)

    // Utilisateur inexistant : convertir 404 en 401
    {
      if (error instanceof NotFoundException) 
        { throw new UnauthorizedException('Utilisateur non trouvé ou compte inexistant'); }
      throw error; // Ne pas masquer les autres erreurs
    }

    // Reconstituer l'identité depuis PostgreSQL
    request.user = {
      sub: user.idUser,
      role: user.role,
    };

    // Autoriser NestJS à poursuivre la requête
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined; // Accepter uniquement le schéma Bearer
  }
}
