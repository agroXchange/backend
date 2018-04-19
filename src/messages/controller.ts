import {
  Authorized,
  Body, CurrentUser, Get, JsonController, NotFoundError, Param, Patch, Post,
  UnauthorizedError
} from "routing-controllers";
import {User} from "../users/entity";
import {Order} from "../orders/entity";
import Message from "./entity";
import {IsString} from 'class-validator'
import {io} from "../index";

class ValidateMessage {
  @IsString()
  message: string
}

@JsonController()
export default class MessageController {

  @Authorized()
  @Post('/orders/:id([0-9]+)/messages')
  async postMessage(
    @Body() body: ValidateMessage,
    @CurrentUser() currentUser: User,
    @Param('id') id: number
  ) {
    const order = await Order.findOne({where: {id}, relations: ['buyer']})
    if (!order) throw new NotFoundError('No order found')

    const {buyer, seller} = order

    const senderIsBuyer = currentUser.profile.id === buyer.id
    const senderIsSeller = currentUser.profile.id === seller.id

    if (!(senderIsBuyer || senderIsSeller)) {
      throw new UnauthorizedError('You are not authorized to send a message in this conversation.')
    }

    let message

    if (senderIsSeller) message = await Message.create({
      content: body.message,
      sender: seller,
      receiver: buyer,
      order
    }).save()

    if (senderIsBuyer) message = await Message.create({
      content: body.message,
      sender: buyer,
      receiver: seller,
      order
    }).save()

    const action = {
      type: 'NEW_MESSAGE',
      payload: message
    }

    io.to(buyer.id).emit('action', action)
    io.to(seller.id).emit('action', action)

    return message
  }

  @Authorized()
  @Get('/messages/unread')
  async getUnreadMessages(
    @CurrentUser() currentUser: User
  ) {
    const unreadMsgs = await Message.find({
      where: {
        receiver: currentUser.profile,
        seen: false
      },
      relations: ['order']
    })

    const orderIdsUnreadMsgs =  unreadMsgs
      .map(m => m.order.id)

    return orderIdsUnreadMsgs
      .filter((id, i) => orderIdsUnreadMsgs.indexOf(id) === i)
  }

  @Authorized()
  @Patch('/messages/:id([0-9]+)')
  async markMessage(
    @Param('id') id: number,
    @CurrentUser() currentUser: User
  ) {
    const msg = await Message.findOne({where:{id}, relations:['receiver']})
    if (!msg) throw new NotFoundError('No msg found.')
    if (currentUser.profile.id === msg.receiver.id) {
      msg.seen = true
      return msg.save()
    }
  }

  @Authorized()
  @Get('/orders/:id([0-9]+)/messages')
  async getMessages(
    @CurrentUser() currentUser: User,
    @Param('id') id: number
  ) {
    const order = await Order.findOne({
      where: {id},
      relations: ['buyer', 'messages', 'messages.sender', 'messages.receiver'],
    })
    if (!order) throw new NotFoundError('No order found')

    const {seller, buyer, messages} = order

    const senderIsBuyer = currentUser.profile.id === buyer.id
    const senderIsSeller = currentUser.profile.id === seller.id

    if (!(senderIsBuyer || senderIsSeller)) throw new UnauthorizedError("You're not authorized.")

    order.messages.sort((a, b) => {
      return Number(new Date(a.createdAt)) - Number(new Date(b.createdAt))
    })

    const seenMessages = messages
      .filter(m => !m.seen && currentUser.profile.id === m.receiver.id)
      .map(m => {
        m.seen = true
        return m.save()
      })

    await Promise.all(seenMessages)

    return order
  }

}