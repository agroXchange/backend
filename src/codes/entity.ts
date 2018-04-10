import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString, IsNumber } from 'class-validator'
import { Product } from '../products/entity'





@Entity()
export class Code extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number;

  @IsNumber()
  @Column('int', { nullable: false })
  code: number;

  @IsString()
  @Column('text', { nullable: false })
  title: string

  @IsString()
  @Column('text', { nullable: false })
  short_title: string;

  @OneToOne(_ => Product, product => product.code,{eager: true})
  product: Product;


 }
