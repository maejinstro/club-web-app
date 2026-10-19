import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import type { Relation } from "typeorm";
import { Affiliations } from "./Affiliations.js";
import { MatchSheets } from "./MatchSheets.js";
import { Membership } from "./Membership.js";
import { TrainingAttendance } from "./TrainingAttendance.js";
import { Exclude } from 'class-transformer'; // <-- Indique à NestJS de retirer ce champ de la réponse JSON

@Index("pk_users", ["idUser"], { unique: true })
@Entity("users", { schema: "public" })
export class Users {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_user" })
  idUser: number;

  @Column("character varying", { name: "email", length: 255, unique: true })
  email: string;

  @Column("character varying", { name: "password_hash" })
  @Exclude() // <-- Indique à NestJS de retirer ce champ de la réponse JSON
  passwordHash: string;

  @Column("character varying", { name: "username", length: 50, unique: true })
  username: string;

  @Column("character varying", {
    name: "last_name",
    nullable: true,
    length: 50,
  })
  lastName: string | null;

  @Column("character varying", {
    name: "first_name",
    nullable: true,
    length: 50,
  })
  firstName: string | null;

  @Column("date", { name: "birthdate", nullable: true })
  birthdate: string | null;

  @Column("character varying", { name: "phone", nullable: true, length: 30 })
  phone: string | null;

  @Column("character varying", {
    name: "position_",
    nullable: true,
    length: 50,
  })
  position: string | null;

  @Column("character varying", { name: "role", length: 50 })
  role: string;

  @OneToMany(() => Affiliations, (affiliations) => affiliations.idUser2)
  affiliations: Relation<Affiliations[]>;

  @OneToMany(() => MatchSheets, (matchSheets) => matchSheets.idUser2)
  matchSheets: Relation<MatchSheets[]>;

  @OneToMany(() => Membership, (membership) => membership.idUser2)
  memberships: Relation<Membership[]>;

  @OneToMany(
    () => TrainingAttendance,
    (trainingAttendance) => trainingAttendance.idUser2
  )
  trainingAttendances: Relation<TrainingAttendance[]>;
}
