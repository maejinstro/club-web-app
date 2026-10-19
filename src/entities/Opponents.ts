import {  Column,  Entity,  Index,  OneToMany,  PrimaryGeneratedColumn} from "typeorm";
import type { Relation } from "typeorm";
import { Matchs } from "./Matchs.js";

@Index("pk_opponents", ["idOpp"], { unique: true })
@Entity("opponents", { schema: "public" })
export class Opponents {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_opp" })
  idOpp: number;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @OneToMany(() => Matchs, (matchs) => matchs.idOpp)
  matchs: Relation<Matchs[]>;
}
