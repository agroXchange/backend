import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString, IsNumber} from 'class-validator'

@Entity()
export class Currency extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number;

  @IsNumber()
  @Column('real', { nullable: true })
  usd: number;

  @IsNumber()
  @Column('real', { nullable: true })
  eur: number;

  @IsNumber()
  @Column('real', { nullable: true })
  crc: number;

  @IsNumber()
  @Column('real', { nullable: true })
  pab: number;

  @IsNumber()
  @Column('real', { nullable: true })
  cop: number;

  @IsString()
  @Column('text', { nullable: true })
  symbol: string;

  @IsString()
  @Column('text', { nullable: true })
  name: string;

  @IsString()
  @Column('date', { nullable: true })
  updated_at: Date;
 }
