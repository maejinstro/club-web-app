import {  Column,  Entity,  Index,  JoinColumn,  ManyToOne,  OneToMany,  PrimaryGeneratedColumn} from "typeorm";
import type { Relation } from "typeorm";
import { TrainingAttendance } from "./TrainingAttendance.js";
import { Saisons } from "./Saisons.js";

@Index("pk_trainings", ["idTraining"], { unique: true })
@Entity("trainings", { schema: "public" })
export class Trainings {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_training" })
  idTraining: number;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("timestamp without time zone", { name: "date_", nullable: true })
  date: Date | null;

  @Column("character varying", {
    name: "training_status",
    length: 50,
    default: () => "'scheduled'",
  })
  trainingStatus: string;

  @OneToMany(
    () => TrainingAttendance,
    (trainingAttendance) => trainingAttendance.idTraining2
  )
  trainingAttendances: Relation<TrainingAttendance[]>;

  @ManyToOne(() => Saisons, (saisons) => saisons.trainings, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "id_saison", referencedColumnName: "idSaison" }])
  idSaison: Relation<Saisons>;
}
