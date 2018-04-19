import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString, IsNumber} from 'class-validator'

@Entity()
export class Currency extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number;

  @IsNumber()
  @Column('real', { nullable: true })
  USD: number;

  @IsNumber()
  @Column('real', { nullable: true })
  EUR: number;

  @IsNumber()
  @Column('real', { nullable: true })
  CRC: number;

  @IsNumber()
  @Column('real', { nullable: true })
  PAB: number;

  @IsNumber()
  @Column('real', { nullable: true })
  COP: number;

  @IsString()
  @Column('text', { nullable: true })
  symbol: string;

  @IsString()
  @Column('text', { nullable: true })
  name: string;

  @IsString()
  @Column('timestamp', { nullable: true, default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
 }
