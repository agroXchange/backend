import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString, IsEmail, MinLength } from 'class-validator'
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
  @Column('text', { nullable: false })
  password: string

  @IsString()
  @Column('text', { nullable: false })
  role: string;

  @OneToOne(_ => Profile, profile => profile.user)
  profile: Profile;

  async setPassword(pass: string) {
    this.password = await bcrypt.hash(pass, 10)
  }

  checkPassword(pass: string) {
    return bcrypt.compare(pass, this.password)
  }

 }
