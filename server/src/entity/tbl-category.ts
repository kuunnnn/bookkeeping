import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { TblUser } from "./tbl-user";

export enum CategoryType {
  expense = "expense",
  income = "income",
}
@Entity()
export class TblCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  // 类别名称
  @Column({ type: "varchar" })
  name!: string;

  // 支出类似收入
  @Column()
  type: CategoryType = CategoryType.expense;

  // 用于最经常使用排序
  @Column({ type: "integer" })
  nums = 0;

  // 累计收入
  @ManyToOne(() => TblUser)
  @JoinColumn()
  user!: TblUser;
  userId!: number;
}
