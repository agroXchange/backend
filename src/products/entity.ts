import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString, IsInt } from 'class-validator'
import { Order } from '../orders/entity'
import { Code } from '../codes/entity'
import { Profile } from '../profiles/entity'


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

  @IsInt()
  @Column('int', { nullable: false })
  volume: number;

  @IsInt()
  @Column('int', { nullable: false })
  price: number;

  @IsString()
  @Column('text', { nullable: false })
  description: string;

  @Column('date', { name: 'edate' })
  expiration: Date;

  @IsString()
  @Column('text', { nullable: false })
  currency: string;

  @Column('date', { name: 'hdate' })
  harvested: Date;

  @IsString()
  @Column('text', { nullable: true })
  certificate: string;

  @ManyToOne(_ => Profile, seller => seller.products, {eager: true})
  seller: Profile;

  @OneToMany(_ => Order, order => order.product)
  orders: Order[]

  @ManyToOne(_ => Code, code => code.product)
  code: Code;

 }
