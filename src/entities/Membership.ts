import { Column, Entity,  Index, JoinColumn,  ManyToOne,  PrimaryGeneratedColumn,} from "typeorm";
import type { Relation } from "typeorm";
import { Saisons } from "./Saisons.js";
import { Users } from "./Users.js";

@Index("pk_membership", ["idMembership"], { unique: true })
@Index("uq_membership_user_saison", ["idSaison", "idUser"], { unique: true })
@Entity("membership", { schema: "public" })
export class Membership {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_membership" })
  idMembership: number;

  @Column("numeric", {
    name: "amount",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  amount: string | null;

  @Column("character varying", {
    name: "status",
    length: 50,
    default: () => "'unpaid'",
  })
  status: string;

  @Column("date", { name: "payment_date", nullable: true })
  paymentDate: string | null;

  @Column("integer", { name: "id_saison"})
  idSaison: number;

  @Column("integer", { name: "id_user"})
  idUser: number;

  @ManyToOne(() => Saisons, (saisons) => saisons.memberships, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "id_saison", referencedColumnName: "idSaison" }])
  idSaison2: Relation<Saisons>;

  @ManyToOne(() => Users, (users) => users.memberships, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "id_user", referencedColumnName: "idUser" }])
  idUser2: Relation<Users>;
}
