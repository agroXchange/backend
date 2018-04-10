import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString, IsBoolean } from 'class-validator'
import { User } from '../users/entity'
import { Product } from '../products/entity'
import { Order } from '../orders/entity'



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
  city: string;

  @Column('text', { nullable: true })
  link: string;

  @Column('text', { default: false })
  approved: boolean;

  @OneToMany(_ => Product, product => product.profile)
  products: Product[]

  @OneToMany(_ => Order, order => order.profile)
  orders: Order[]

 }
