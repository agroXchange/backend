import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString, IsNumber} from 'class-validator'
import { Product } from '../products/entity'
import {User} from "../users/entity";


@Entity()
export class Order extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number;

  @IsString()
  @Column('text', { nullable: true })
  volume: string;

  @IsString()
  @Column('text', { nullable: true })
  comments: string;

  @IsString()
  @Column('text', { nullable: true })
  status: string;

  @IsString()
  @Column('date', { nullable: true })
  date: string;

  @IsString()
  @Column('text', { nullable: true })
  ICO: string;

  @ManyToOne(_ => Product, product => product.orders)
  product: Product;

  @ManyToOne(_ => User, user => user.orders)
  user: User;


 }
