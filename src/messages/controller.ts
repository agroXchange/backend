import {
  Body, CurrentUser, Get, JsonController, NotFoundError, Param, Post,
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

  @Get('/orders/:id([0-9]+)/messages')
  async getMessages(
    @CurrentUser() currentUser: User,
    @Param('id') id: number
  ) {
    const order = await Order.findOne({where: {id}, relations: ['buyer', 'messages', 'messages.sender', 'messages.receiver']})
    if (!order) throw new NotFoundError('No order found')

    const {seller, buyer} = order

    const senderIsBuyer = currentUser.profile.id === buyer.id
    const senderIsSeller = currentUser.profile.id === seller.id

    if (!(senderIsBuyer || senderIsSeller)) throw new UnauthorizedError("You're not authorized.")

    return order
  }

}