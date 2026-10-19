import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchsService } from './matchs.service.js';
import { MatchsController } from './matchs.controller.js';
import { Matchs } from '../entities/Matchs.js';
import { AuthModule } from '../auth/auth.module.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Matchs]), AuthModule, UsersModule],
  controllers: [MatchsController],
  providers: [MatchsService],
  exports: [MatchsService],
})
export class MatchsModule {}