import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString, IsNumber} from 'class-validator'
import { Profile } from '../profiles/entity'
import { Product } from '../products/entity'

@Entity()
export class Order extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number;

  @IsNumber()
  @Column('int', { nullable: false })
  volume: number;

  @IsString()
  @Column('text', { nullable: false })
  comments: string

  @IsString()
  @Column('text', { nullable: false })
  status: string;

  @Column('date', { default: new Date() })
  createdAt: Date

  @ManyToOne(_ => Product, product => product.orders)
  product: Product;

  @ManyToOne(_ => Profile, profile => profile.orders)
  profile: Profile;

 }
