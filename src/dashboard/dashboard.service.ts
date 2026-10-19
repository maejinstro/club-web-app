import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Matchs } from '../entities/Matchs.js';
import { MatchSheets } from '../entities/MatchSheets.js';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Matchs)
    private readonly matchRepository: Repository<Matchs>,
    @InjectRepository(MatchSheets)
    private readonly matchSheetsRepository: Repository<MatchSheets>,
  ) { }

  /**
   * Helper privé pour convertir la valeur de la colonne home_away de la BDD.
   * Gère explicitement 'home', 'away' et prévoie NULL / valeur inconnue.
   */
  private parseLocation(homeAwayValue?: string | null): 'home' | 'away' | null {
    if (!homeAwayValue) {
      return null;
    }

    const value = homeAwayValue.toLowerCase().trim();

    if (value === 'home') {
      return 'home';
    }
    if (value === 'away') {
      return 'away';
    }

    return null;
  }

  async getTeamStats(seasonId: number) {
    if (!seasonId || isNaN(Number(seasonId))) {
      throw new BadRequestException("L'identifiant de saison est invalide.");
    }

    // 1. Récupérer les matchs de la saison demandée via QueryBuilder (évite le bug de sérialisation d'objet)
    const allMatches = await this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.idOpp', 'opp')
      .where('match.idSaison = :seasonId', { seasonId })
      .orderBy('match.dateM', 'DESC')
      .getMany();

    // 2. Ne conserver que les matchs avec matchStatus = 'played' et deux scores renseignés
    const validMatches = allMatches.filter((match) => {
      const isPlayed = match.matchStatus?.toLowerCase() === 'played';
      const hasScores =
        match.scoreClub !== null &&
        match.scoreClub !== undefined &&
        match.scoreOpp !== null &&
        match.scoreOpp !== undefined;
      return isPlayed && hasScores;
    });

    // Initialisation des variables de calcul
    let wins = 0;
    let draws = 0;
    let losses = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    // Calculs sur l'ensemble des matchs joués
    validMatches.forEach((match) => {
      const gf = Number(match.scoreClub);
      const ga = Number(match.scoreOpp);

      goalsFor += gf;
      goalsAgainst += ga;

      if (gf > ga) {
        wins += 1;
      } else if (gf === ga) {
        draws += 1;
      } else {
        losses += 1;
      }
    });

    const matchesPlayed = validMatches.length;
    // Barème : 3 pts / victoire, 1 pt / nul, 0 pt / défaite
    const points = wins * 3 + draws * 1;
    const goalDifference = goalsFor - goalsAgainst;

    // Conserver au maximum les 5 derniers résultats
    const recentMatches = validMatches.slice(0, 5);

    const lastMatches = recentMatches.map((match) => {
      const gf = Number(match.scoreClub);
      const ga = Number(match.scoreOpp);

      let result: 'W' | 'D' | 'L';
      if (gf > ga) {
        result = 'W';
      } else if (gf === ga) {
        result = 'D';
      } else {
        result = 'L';
      }

      return {
        id: match.idMatch,
        date: match.dateM,
        opponent: match.idOpp?.name || 'Inconnu',
        location: this.parseLocation(match.homeAway),
        teamScore: gf,
        opponentScore: ga,
        result,
      };
    });

    return {
      seasonId,
      matchesPlayed,
      wins,
      draws,
      losses,
      points,
      goalsFor,
      goalsAgainst,
      goalDifference,
      lastMatches,
    };
  }

  async getPlayerStats(userId: number, seasonId: number) {
    if (!userId || isNaN(Number(userId))) {
      throw new BadRequestException("L'identifiant utilisateur est invalide.");
    }

    // Récupération directe des feuilles jointes aux matchs et à la saison
    const queryResults = await this.matchSheetsRepository
      .createQueryBuilder('sheet')
      .innerJoin('matchs', 'match', 'match.id_match = sheet.id_match')
      .leftJoin('opponents', 'opp', 'opp.id_opp = match.id_opp')
      .select([
        'sheet.idUser AS "idUser"',
        'sheet.idMatch AS "idMatch"',
        'sheet.playtime AS "playtime"',
        'sheet.playerGoals AS "playerGoals"',
        'sheet.playerAssists AS "playerAssists"',
        'sheet.playerNote AS "playerNote"',
        'match.idMatch AS "matchId"',
        'match.dateM AS "dateM"',
        'match.matchStatus AS "matchStatus"',
        'match.scoreClub AS "scoreClub"',
        'match.scoreOpp AS "scoreOpp"',
        'match.homeAway AS "homeAway"',
        'match.idSaison AS "seasonId"',
        'opp.name AS "opponentName"',
      ])
      .where('sheet.idUser = :userId', { userId })
      .andWhere('match.idSaison = :seasonId', { seasonId })
      .getRawMany();

    // Filtrer uniquement les matchs joués (status 'played', deux scores non nuls)
    const validRows = queryResults.filter((row) => {
      const isPlayed = row.matchStatus?.toLowerCase() === 'played';
      const hasScores =
        row.scoreClub !== null &&
        row.scoreClub !== undefined &&
        row.scoreOpp !== null &&
        row.scoreOpp !== undefined;
      return isPlayed && hasScores;
    });

    let matchesPlayed = 0;
    let minutes = 0;
    let goals = 0;
    let assists = 0;
    let totalNotes = 0;
    let notesCount = 0;

    const matchHistory = validRows.map((row) => {
      const playtime = Number(row.playtime || 0);
      const playerGoals = Number(row.playerGoals || 0);
      const playerAssists = Number(row.playerAssists || 0);

      const playerNote =
        row.playerNote !== null && row.playerNote !== undefined
          ? Number(row.playerNote)
          : null;

      // Seules les participations réelles (playtime > 0) sont comptabilisées
      if (playtime > 0) {
        matchesPlayed += 1;
        minutes += playtime;
        goals += playerGoals;
        assists += playerAssists;

        // Calculer la note moyenne UNIQUEMENT pour les participations avec du temps de jeu
        if (playerNote !== null && !isNaN(playerNote)) {
          totalNotes += playerNote;
          notesCount += 1;
        }
      }

      const gf = Number(row.scoreClub);
      const ga = Number(row.scoreOpp);
      let result: 'W' | 'D' | 'L';
      if (gf > ga) {
        result = 'W';
      } else if (gf === ga) {
        result = 'D';
      } else {
        result = 'L';
      }

      return {
        idMatch: row.matchId,
        date: row.dateM,
        opponent: row.opponentName || 'Inconnu',
        location: this.parseLocation(row.homeAway),
        result,
        playtime,
        goals: playerGoals,
        assists: playerAssists,
        note: playerNote,
      };
    });

    const averageNote =
      notesCount > 0 ? Number((totalNotes / notesCount).toFixed(2)) : null;

    return {
      seasonId,
      matchesPlayed,
      minutes,
      goals,
      assists,
      averageNote,
      matchHistory,
    };
  }
}