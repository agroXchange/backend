import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString, IsNumber } from 'class-validator'
import { Order } from '../orders/entity'
import { Code } from '../codes/entity'
import {User} from "../users/entity";



@Entity()
export class Product extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number;

  @IsString()
  @Column('text',{ nullable: false })
  name: string;

  @IsString()
  @Column('text', { nullable: true })
  photo: string

  @IsString()
  @Column('text', { nullable: false })
  volume: string;

  @IsNumber()
  @Column('int', { nullable: false })
  price: number;

  @IsString()
  @Column('text', { nullable: false })
  description: string;

  @IsString()
  @Column('text', { nullable: false })
  city: string;

  @Column('date', { default: new Date() })
  expiration_date = Date

  @IsString()
  @Column('text', { nullable: false })
  currency: string;

  @Column('date', { default: new Date() })
  harvested: Date

  @IsString()
  @Column('text', { nullable: true })
  certificate: string;

  @ManyToOne(_ => User, user => user.products)
  user: User;

  @OneToMany(_ => Order, order => order.product)
  orders: Order[]

  @OneToOne(_ => Code, code => code.product)
  code: Code;


 }
