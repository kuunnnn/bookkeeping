import omit from "lodash/omit";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TblUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", default: "", unique: true })
  name = "";

  @Column({ type: "varchar", length: 11, unique: true })
  phone!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: "varchar" })
  avatar = "";

  @Column({ type: "varchar" })
  salt!: string;

  @Column({ type: "varchar" })
  password!: string;

  toJSON() {
    return omit(this, ["password", "salt"]);
  }
}
