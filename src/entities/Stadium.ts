import {  Column,  Entity,  Index,  OneToMany,  PrimaryGeneratedColumn} from "typeorm";
import type { Relation } from "typeorm";
import { Matchs } from "./Matchs.js";

@Index("pk_stadium", ["idStadium"], { unique: true })
@Entity("stadium", { schema: "public" })
export class Stadium {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_stadium" })
  idStadium: number;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("character varying", { name: "street", length: 255 })
  street: string;

  @Column("character varying", { name: "town", length: 100 })
  town: string;

  @Column("boolean", { name: "parking", nullable: true })
  parking: boolean | null;

  @OneToMany(() => Matchs, (matchs) => matchs.idStadium)
  matchs: Relation<Matchs[]>;
}
