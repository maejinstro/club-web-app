export interface MatchResponseDto {
  idMatch: number;
  date: Date;
  seasonId: number;
  opponent: string;
  location: string;
  scoreClub: number | null;
  scoreOpp: number | null;
  status: string;
  result: 'victoire' | 'nul' | 'défaite' | null;
}