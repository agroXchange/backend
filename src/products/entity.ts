import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString, IsNumber } from 'class-validator'
import { Profile } from '../profiles/entity'
import { Order } from '../orders/entity'
import { Code } from '../codes/entity'



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
  destination: string;

  @IsString()
  @Column('text', { nullable: false })
  description: string;

  @IsString()
  @Column('text', { nullable: false })
  city: string;

  @IsString()
  @Column('text', { nullable: true })
  expiration_date: string;

  @IsString()
  @Column('text', { nullable: false })
  currency: string;

  @ManyToOne(_ => Profile, profile => profile.products)
  profile: Profile;

  @OneToMany(_ => Order, order => order.product, {eager: true})
  orders: Order[]

  @OneToOne(_ => Code, code => code.product)
  code: Code;


 }
