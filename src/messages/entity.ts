import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Order} from "../orders/entity";
import {Profile} from "../profiles/entity";
import {IsString} from 'class-validator'

@Entity()
export default class Message extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @IsString()
  @Column('text')
  content: string

  @Column('boolean', {default: false})
  seen: boolean

  @Column('timestamp', {default: () => "CURRENT_TIMESTAMP"})
  createdAt: Date

  @ManyToOne(_ => Order, order => order.messages)
  order: Order

  @ManyToOne(_ => Profile, profile => profile.sentMessages)
  sender: Profile

  @ManyToOne(_ => Profile, profile => profile.receivedMessages)
  receiver: Profile

}