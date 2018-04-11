import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString } from 'class-validator'
import { Product } from '../products/entity'

@Entity()
export class Code extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number;

  @IsString()
  @Column('varchar', { length: 10 })
  code: string;

  @IsString()
  @Column('text', { nullable: false })
  titleeng: string

  @IsString()
  @Column('text', { nullable: true })
  titleesp: string;

  @OneToMany(_ => Product, product => product.code)
  product: Product[];

}
