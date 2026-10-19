import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";
import { Matchs } from "./Matchs.js";
import { Users } from "./Users.js";

@Index("pk_match_sheets", ["idMatch", "idUser"], { unique: true })
@Entity("match_sheets", { schema: "public" })
export class MatchSheets {
  @Column("integer", { primary: true, name: "id_user" })
  idUser: number;

  @Column("integer", { primary: true, name: "id_match" })
  idMatch: number;

  @Column("numeric", {
    name: "player_note",
    nullable: true,
    precision: 4,
    scale: 2,
  })
  playerNote: string | null;

  @Column("integer", { name: "player_goals", default: () => "0" })
  playerGoals: number;

  @Column("integer", { name: "player_assists", default: () => "0" })
  playerAssists: number;

  @Column("integer", { name: "mvp_rank", nullable: true })
  mvpRank: number | null;

  @Column("integer", { name: "c_yellow", default: () => "0" })
  cYellow: number;

  @Column("integer", { name: "c_red", default: () => "0" })
  cRed: number;

  @Column("boolean", { name: "injury", default: () => "false" })
  injury: boolean;

  @Column("integer", { name: "playtime", default: () => "0" })
  playtime: number;

  @Column("character varying", { name: "availability_status", length: 50 })
  availabilityStatus: string;

  @ManyToOne(() => Matchs, (matchs) => matchs.matchSheets, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "id_match", referencedColumnName: "idMatch" }])
  idMatch2: Relation<Matchs>;

  @ManyToOne(() => Users, (users) => users.matchSheets, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "id_user", referencedColumnName: "idUser" }])
  idUser2: Relation<Users>;
}
