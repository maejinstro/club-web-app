import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import type { Relation } from "typeorm";
import { Standing } from "./Standing.js";

@Index("pk_mainclub", ["idClub"], { unique: true })
@Entity("mainclub", { schema: "public" })
export class Mainclub {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_club" })
  idClub: number;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("character varying", {
    name: "registration_number",
    nullable: true,
    length: 50,
  })
  registrationNumber: string | null;

  @Column("character varying", {
    name: "email_club",
    nullable: true,
    length: 255,
  })
  emailClub: string | null;

  @Column("character varying", {
    name: "head_office",
    nullable: true,
    length: 255,
  })
  headOffice: string | null;

  @Column("character varying", {
    name: "president_name",
    nullable: true,
    length: 100,
  })
  presidentName: string | null;

  @Column("character varying", {
    name: "vice_president_name",
    nullable: true,
    length: 100,
  })
  vicePresidentName: string | null;

  @Column("character varying", {
    name: "main_color_hex",
    nullable: true,
    length: 7,
  })
  mainColorHex: string | null;

  @Column("character varying", {
    name: "second_color_hex",
    nullable: true,
    length: 7,
  })
  secondColorHex: string | null;

  @OneToMany(() => Standing, (standing) => standing.idClub2)
  standings: Relation<Standing[]>;
}
