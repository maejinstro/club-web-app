import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ConfigModule } from '@nestjs/config';

import { Affiliations } from './entities/Affiliations.js';
import { Mainclub } from './entities/Mainclub.js';
import { Matchs } from './entities/Matchs.js';
import { MatchSheets } from './entities/MatchSheets.js';
import { Membership } from './entities/Membership.js';
import { Opponents } from './entities/Opponents.js';
import { Saisons } from './entities/Saisons.js';
import { Stadium } from './entities/Stadium.js';
import { Standing } from './entities/Standing.js';
import { TrainingAttendance } from './entities/TrainingAttendance.js';
import { Trainings } from './entities/Trainings.js';
import { Users } from './entities/Users.js';
import { MatchsModule } from './matchs/matchs.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, // Charge les variables d'environnement
    validate: (env) => {
      const secret = env.JWT_SECRET;
      if (typeof secret !== 'string' || secret.trim().length < 32) { throw new Error('JWT_SECRET absent ou trop court'); } // Vérifie la présence d'une clé JWT correcte
      return env;
    },
  }),
  // Connexion PostgreSQL 
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
      Affiliations,
      Mainclub,
      Matchs,
      MatchSheets,
      Membership,
      Opponents,
      Saisons,
      Stadium,
      Standing,
      TrainingAttendance,
      Trainings,
      Users,
    ], synchronize: false,
  }), AuthModule, UsersModule, MatchsModule, DashboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
