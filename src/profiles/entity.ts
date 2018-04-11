import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString, IsEmail } from 'class-validator'
import {Order} from "../orders/entity"
import {Product} from "../products/entity"

@Entity()
export class Profile extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number;

  @IsString()
  @Column('text',{ nullable: false })
  name: string;

  @IsString()
  @Column('text', { nullable: false })
  address: string

  @IsString()
  @Column('text', { nullable: false })
  phone: string;

  @IsString()
  @Column('text', { nullable: false })
  type: string;

  @IsString()
  @Column('text', { nullable: false })
  field: string;

  @Column('text', { nullable: true })
  chamberOfCommerce: string;

  @IsString()
  @Column('text', { nullable: false })
  country: string;

  @IsString()
  @Column('text', { nullable: false })
  city: string;

  // @IsString()
  @Column('text', { nullable: true, default: 'null' })
  logo: string;

  @IsEmail()
  @Column('text', { nullable: true })
  email: string;

  @Column('text', { nullable: true })
  link: string;

  @OneToMany(_ => Product, product => product.seller)
  products: Product[]

  @OneToMany(_ => Order, order => order.buyer)
  orders: Order[]

 }
