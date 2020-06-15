import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { TblAccount } from "./tbl-account";
import { TblCategory } from "./tbl-category";
import { TblUser } from "./tbl-user";

@Entity()
export class TblRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  // 金额
  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  money!: number;

  // 备注
  @Column({
    type: "varchar",
    length: 255,
    default: "",
  })
  remark!: string;

  // 时间
  @Column("timestamp")
  date!: Date;

  @ManyToOne(() => TblUser)
  @JoinColumn()
  user!: TblUser;
  userId!: number;
  @ManyToOne(() => TblAccount)
  @JoinColumn()
  account!: TblAccount;
  accountId!: number;
  @ManyToOne(() => TblCategory)
  @JoinColumn()
  category!: TblCategory;
  categoryId!: number;
}
