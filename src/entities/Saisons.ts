import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import type { Relation } from "typeorm";
import { Affiliations } from "./Affiliations.js";
import { Matchs } from "./Matchs.js";
import { Membership } from "./Membership.js";
import { Standing } from "./Standing.js";
import { Trainings } from "./Trainings.js";

@Index("pk_saisons", ["idSaison"], { unique: true })
@Index("uq_saisons_year", ["year"], { unique: true })
@Entity("saisons", { schema: "public" })
export class Saisons {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_saison" })
  idSaison: number;

  @Column("character varying", { name: "year_", unique: true, length: 15 })
  year: string;

  @OneToMany(() => Affiliations, (affiliations) => affiliations.idSaison2)
  affiliations: Relation<Affiliations[]>;

  @OneToMany(() => Matchs, (matchs) => matchs.idSaison)
  matchs: Relation<Matchs[]>;

  @OneToMany(() => Membership, (membership) => membership.idSaison2)
  memberships: Relation<Membership[]>;

  @OneToMany(() => Standing, (standing) => standing.idSaison2)
  standings: Relation<Standing[]>;

  @OneToMany(() => Trainings, (trainings) => trainings.idSaison)
  trainings: Relation<Trainings[]>;
}
