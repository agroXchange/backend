import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId, OneToMany} from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString, IsNumber} from 'class-validator'
import { Product } from '../products/entity'
import {Profile} from "../profiles/entity";
import Message from "../messages/entity";


@Entity()
export class Order extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number;

  @IsString()
  @Column('text', { nullable: true })
  volume: number;

  @IsString()
  @Column('text', { nullable: true })
  comments: string;

  @IsString()
  @Column('text',{ nullable: true, default: 'Pending'})
  status: string;

  @IsString()
  @Column('timestamp', { nullable: true, default: () => "CURRENT_TIMESTAMP" })
  date: Date;

  @IsString()
  @Column('text', { nullable: true })
  ICO: string;

  @Column('boolean', { default: false })
  seen: boolean

  @ManyToOne(_ => Product, product => product.orders, {eager: true})
  product: Product;

  @ManyToOne(_ => Profile, buyer => buyer.orders)
  buyer: Profile;

  @ManyToOne(_ => Profile, seller => seller.ordersReceived, {eager: true})
  seller: Profile;

  @OneToMany(_ => Message, message => message.order)
  messages: Message[]

 }
