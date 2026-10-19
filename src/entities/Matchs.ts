import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import type { Relation } from "typeorm";
import { MatchSheets } from "./MatchSheets.js";
import { Opponents } from "./Opponents.js";
import { Saisons } from "./Saisons.js";
import { Stadium } from "./Stadium.js";

@Index("pk_matchs", ["idMatch"], { unique: true })
@Entity("matchs", { schema: "public" })
export class Matchs {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_match" })
  idMatch: number;

  @Column("timestamp without time zone", { name: "date_m" })
  dateM: Date;

  @Column("integer", { name: "score_club", nullable: true })
  scoreClub: number | null;

  @Column("integer", { name: "score_opp", nullable: true })
  scoreOpp: number | null;

  @Column("character varying", {
    name: "match_status",
    length: 50,
    default: () => "'scheduled'",
  })
  matchStatus: string;

  @Column("character varying", {
    name: "home_away",
    nullable: true,
    length: 50,
  })
  homeAway: string | null;

  @OneToMany(() => MatchSheets, (matchSheets) => matchSheets.idMatch2)
  matchSheets: Relation<MatchSheets[]>;

  @ManyToOne(() => Opponents, (opponents) => opponents.matchs, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "id_opp", referencedColumnName: "idOpp" }])
  idOpp: Relation<Opponents>;

  @ManyToOne(() => Saisons, (saisons) => saisons.matchs, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "id_saison", referencedColumnName: "idSaison" }])
  idSaison: Relation<Saisons>;

  @ManyToOne(() => Stadium, (stadium) => stadium.matchs, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "id_stadium", referencedColumnName: "idStadium" }])
  idStadium: Relation<Stadium>;
}
