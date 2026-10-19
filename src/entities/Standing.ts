import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import type { Relation } from "typeorm";
import { Mainclub } from "./Mainclub.js";
import { Saisons } from "./Saisons.js";

@Index("uq_standing_club_saison", ["idClub", "idSaison"], { unique: true })
@Index("pk_standing", ["idStanding"], { unique: true })
@Entity("standing", { schema: "public" })
export class Standing {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_standing" })
  idStanding: number;

  @Column("integer", { name: "match_played", default: () => "0" })
  matchPlayed: number;

  @Column("integer", { name: "win", default: () => "0" })
  win: number;

  @Column("integer", { name: "draw", default: () => "0" })
  draw: number;

  @Column("integer", { name: "lose", default: () => "0" })
  lose: number;

  @Column("integer", { name: "points", nullable: true })
  points: number | null;

  @Column("integer", { name: "goal_scored", default: () => "0" })
  goalScored: number;

  @Column("integer", { name: "goal_conceded", default: () => "0" })
  goalConceded: number;

  @Column("integer", { name: "goal_diff", nullable: true })
  goalDiff: number | null;

  @Column("integer", { name: "ranking_position", nullable: true })
  rankingPosition: number | null;

  @Column("integer", { name: "id_club"})
  idClub: number;

  @Column("integer", { name: "id_saison"})
  idSaison: number;

  @ManyToOne(() => Mainclub, (mainclub) => mainclub.standings, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "id_club", referencedColumnName: "idClub" }])
  idClub2: Relation<Mainclub>;

  @ManyToOne(() => Saisons, (saisons) => saisons.standings, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "id_saison", referencedColumnName: "idSaison" }])
  idSaison2: Relation<Saisons>;
}
