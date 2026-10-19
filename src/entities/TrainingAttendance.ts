import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";
import { Trainings } from "./Trainings.js";
import { Users } from "./Users.js";

@Index("pk_training_attendance", ["idTraining", "idUser"], { unique: true })
@Entity("training_attendance", { schema: "public" })
export class TrainingAttendance {
  @Column("integer", { primary: true, name: "id_user" })
  idUser: number;

  @Column("integer", { primary: true, name: "id_training" })
  idTraining: number;

  @Column("character varying", { name: "user_training_status", length: 50 })
  userTrainingStatus: string;

  @ManyToOne(() => Trainings, (trainings) => trainings.trainingAttendances, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "id_training", referencedColumnName: "idTraining" }])
  idTraining2: Relation<Trainings>;

  @ManyToOne(() => Users, (users) => users.trainingAttendances, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "id_user", referencedColumnName: "idUser" }])
  idUser2: Relation<Users>;
}
