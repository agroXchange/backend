import {
  Authorized,
  JsonController,
  Param,
  BadRequestError,
  NotFoundError,
  Get,
  Body,
  Patch,
  Delete,
  HttpCode,
  Post,
  HeaderParam,
  CurrentUser

} from 'routing-controllers'
import { Order } from './entity'
import { User } from '../users/entity'
import { Profile } from '../profiles/entity'
import { Product } from '../products/entity'

@JsonController()
export default class orderController {

  //@Authorized() //TODO: activate once testing is over
  @Get('/orders/all')
  @HttpCode(200)
  getOrders() {
    return Order.find({
      relations: ['buyer']
    })
  }

  //@Authorized()
  @Get('/orders')
  async getUser(
    @CurrentUser() currentUser: User
  ) {
    const buyer = currentUser.profile
    return Order.find({where: {buyer}})
  }

  //@Authorized() //TODO: activate once testing is over
  @Get('/orders/:id([0-9]+)')
  @HttpCode(200)
  getOrderbyID(
    @Param('id') id: number
  ) {
    const group = Order.findOneById(id)
    return group
  }

  //@Authorized() //TODO: activate once testing is over
  @Post('/products/:id([0-9]+)/orders')
  @HttpCode(200)
  async addOrder(
    @Param('id') productId: number,
    @CurrentUser() currentUser: User,
    @Body() order: Order
  ) {
    const buyer = currentUser.profile
    const product = await Product.findOneById(productId)
    const newOrder=  await Order.create({
    volume: order.volume,
    comments: order.comments,
    status: order.status,
    date: order.date,
    ICO: order.ICO,
    buyer: buyer,
    product: product,
    }).save()
    return newOrder

  }

  //@Authorized() //TODO: activate once testing is over
  @Patch('/orders/:id([0-9]+)')
  @HttpCode(200)
  async changeOrder(
    @Param('id') orderId: number,
    @Body() order: Partial<Order>
  ) {

      const or =await Order.findOneById(orderId)
      if(!(or!.status === 'Pending')) throw new BadRequestError('You are not allow to do this.')
      const merged = await Order.merge(or!, order).save()
      return merged
  }

}
