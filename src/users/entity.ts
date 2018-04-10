import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString, IsEmail, MinLength } from 'class-validator'
import { Profile } from '../profiles/entity'


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


 }
