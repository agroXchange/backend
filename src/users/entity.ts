import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany} from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString, IsEmail, MinLength } from 'class-validator'
import {Exclude} from 'class-transformer'
import { Profile } from '../profiles/entity'
import * as bcrypt from 'bcrypt'

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
  role: string;

  @Column('boolean', { default: false })
  approved: boolean;

  @OneToOne(_ => Profile, {eager: true})
  @JoinColumn()
  profile: Profile;

  @Column('timestamp', {default: () => "CURRENT_TIMESTAMP"})
  createdAt: Date

  @Column('timestamp', {default: () => "CURRENT_TIMESTAMP"})
  updatedAt: Date

  async setPassword(pass: string) {
    this.password = await bcrypt.hash(pass, 10)
  }

  checkPassword(pass: string): Promise<boolean> {
    return bcrypt.compare(pass, this.password)
  }

 }
