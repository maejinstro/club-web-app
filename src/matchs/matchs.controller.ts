import { Controller, Get, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { MatchsService } from './matchs.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('matchs')
export class MatchsController {
  constructor(private readonly matchsService: MatchsService) {}

  @Get()
  async findAll(
    @Query('seasonId') seasonIdStr: string,
    @Query('status') status?: string,
  ) {
    if (!seasonIdStr) {
      throw new BadRequestException("Le paramètre 'seasonId' est obligatoire.");
    }

    const seasonId = Number(seasonIdStr);
    if (isNaN(seasonId) || !Number.isInteger(seasonId) || seasonId <= 0) {
      throw new BadRequestException("Le paramètre 'seasonId' doit être un entier positif valide.");
    }

    return await this.matchsService.findAll(seasonId, status);
  }

  /*
  // Desactivé temporairement jusqu'à la finalisation des DTOs d'écriture

  @Post()
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchsService.create(createMatchDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchsService.update(+id, updateMatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchsService.remove(+id);
  }
  */
}