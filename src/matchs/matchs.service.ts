import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/create-match.dto.js';
import { UpdateMatchDto } from './dto/update-match.dto.js';
import { MatchResponseDto } from './dto/response-match.dto.js';
import { Matchs } from '../entities/Matchs.js';

@Injectable()
export class MatchsService {
  constructor(
    @InjectRepository(Matchs)
    private readonly matchsRepository: Repository<Matchs>,
  ) {}

  create(createMatchDto: CreateMatchDto) {
    return 'This action adds a new match';
  }

  async findAll(seasonId: number, status?: string): Promise<MatchResponseDto[]> {
    const query = this.matchsRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.idSaison', 'saison')
      .leftJoinAndSelect('match.idOpp', 'opponent')
      .leftJoinAndSelect('match.idStadium', 'stadium')
      .where('saison.idSaison = :seasonId', { seasonId }); // Utilisation de la jointure pour filtrer

    if (status) {
      query.andWhere('match.matchStatus = :status', { status });
    }

    query.orderBy('match.dateM', 'DESC');

    const matchs = await query.getMany();

    return matchs.map((match) => this.formatMatchResponse(match));
  }

  private formatMatchResponse(match: Matchs): MatchResponseDto {
    return {
      idMatch: match.idMatch,
      date: match.dateM,
      seasonId: match.idSaison?.idSaison ?? null,
      opponent: match.idOpp?.name ?? '',
      location: match.homeAway ?? '',
      scoreClub: match.scoreClub,
      scoreOpp: match.scoreOpp,
      status: match.matchStatus,
      result: this.calculateResult(match),
    };
  }

  private calculateResult(match: Matchs): 'victoire' | 'nul' | 'défaite' | null {
    if (match.matchStatus !== 'played' || match.scoreClub === null || match.scoreOpp === null) {
      return null;
    }

    if (match.scoreClub > match.scoreOpp) {
      return 'victoire';
    } else if (match.scoreClub === match.scoreOpp) {
      return 'nul';
    } else {
      return 'défaite';
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} match`;
  }

  update(id: number, updateMatchDto: UpdateMatchDto) {
    return `This action updates a #${id} match`;
  }

  remove(id: number) {
    return `This action removes a #${id} match`;
  }
}