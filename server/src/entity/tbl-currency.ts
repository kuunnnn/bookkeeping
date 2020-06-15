import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TblCurrency {
  @PrimaryGeneratedColumn()
  id!: number;

  // 币种名称
  @Column({ unique: true })
  name!: string;

  // 货币代码
  @Column({ unique: true })
  code!: string;

  // 货币符号
  @Column({ type: "varchar" })
  symbol!: string;
}
