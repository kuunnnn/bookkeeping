import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { TblCurrency } from "./tbl-currency";
import { TblUser } from "./tbl-user";

@Entity()
export class TblAccount {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  name!: string;

  // 账户初始余额
  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
  })
  initialAmount = 0;

  // 累计
  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
  })
  expenses = 0;

  // 累计收入
  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
  })
  incomes = 0;

  // 是否为默认账户
  @Column({ type: "tinyint" })
  isDefault = false;

  @ManyToOne(() => TblUser)
  @JoinColumn()
  user!: TblUser;
  userId!: number;

  // 币种
  @ManyToOne(() => TblCurrency)
  @JoinColumn()
  currency!: TblCurrency;
  currencyId!: number;
}
