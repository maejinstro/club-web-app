import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import type { Relation } from "typeorm";
import { Saisons } from "./Saisons.js";
import { Users } from "./Users.js";

@Index("pk_affiliations", ["idAffiliation"], { unique: true })
@Index("uq_affiliation_user_saison", ["idSaison", "idUser"], { unique: true })
@Entity("affiliations", { schema: "public" })
export class Affiliations {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_affiliation" })
  idAffiliation: number;

  @Column("character varying", { name: "affiliation_number", length: 50 })
  affiliationNumber: string;

  @Column("character varying", {
    name: "status",
    length: 50,
    default: () => "'inactive'",
  })
  status: string;

  @Column("date", { name: "affiliation_date" })
  affiliationDate: string;

  @Column("integer", { name: "id_user"})
  idUser: number;

  @Column("integer", { name: "id_saison"})
  idSaison: number;

  @ManyToOne(() => Saisons, (saisons) => saisons.affiliations, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "id_saison", referencedColumnName: "idSaison" }])
  idSaison2: Relation<Saisons>;

  @ManyToOne(() => Users, (users) => users.affiliations, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "id_user", referencedColumnName: "idUser" }])
  idUser2: Relation<Users>;
}
