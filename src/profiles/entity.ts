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
  telephone: string;

  @IsString()
  @Column('text', { nullable: false })
  type: string;

  @IsString()
  @Column('text', { nullable: false })
  field: string;

  @IsString()
  @Column('text', { nullable: true })
  ChambersOfCommerce: string;

  @IsString()
  @Column('text', { nullable: false })
  city: string;

  @IsString()
  @Column('text', { nullable: true })
  link: string;

  @IsBoolean()
  @Column('text', { nullable: false })
  approved: boolean;

  @OneToOne(_ => User, user => user.profile,{eager: true})
  user: User;

  @OneToMany(_ => Product, product => product.profile, {eager: true})
  products: Product[]

  @OneToMany(_ => Order, order => order.profile, {eager: true})
  orders: Order[]

 }
