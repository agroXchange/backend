import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany} from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString, IsEmail, MinLength } from 'class-validator'
import {Exclude} from 'class-transformer'
import { Profile } from '../profiles/entity'
import * as bcrypt from 'bcrypt'
import {Order} from "../orders/entity";
import {Product} from "../products/entity";

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number;

  @IsEmail()
  @Column('text', { nullable: false })
  email: string;

  @IsString()
  @MinLength(8)
  @Exclude({ toPlainOnly: true })
  @Column('text', { nullable: false })
  password: string

  @Column('text', { default: 'user' })
  role?: string;

  @OneToOne(_ => Profile)
  @JoinColumn()
  profile: Profile;

  @OneToMany(_ => Product, product => product.profile)
  products: Product[]

  @OneToMany(_ => Order, order => order.profile)
  orders: Order[]

  async setPassword(pass: string) {
    this.password = await bcrypt.hash(pass, 10)
  }

  checkPassword(pass: string): Promise<boolean> {
    return bcrypt.compare(pass, this.password)
  }

 }
