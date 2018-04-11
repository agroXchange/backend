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
import { Product } from '../products/entity'

@JsonController()
export default class orderController {

  //@Authorized() //TODO: activate once testing is over
  @Get('/orders')
  @HttpCode(200)
  getOrders() {
    return Order.find({
      relations: ['buyer']
    })
  }

  //@Authorized() //TODO: activate once testing is over
  @Get('/orders/:id([0-9]+)/user')
  async getUser(
    @Param('id') id: number,
    @CurrentUser() currentUser: User
  ) {
      const user = await User.findOneById(id)

      return Order.find({where: {user}})
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
    @Body() order: Order
  ) {
    const group: any = await Product.findOneById(productId)
    await Order.create({
    volume: order.volume,
    comments: order.comments,
    status: order.status,
    date: order.date,
    ICO: order.ICO,

    }).save()
    return "Succesfully added new order"

  }

  //@Authorized() //TODO: activate once testing is over
  @Patch('/orders/:id([0-9]+)')
  @HttpCode(200)
  async changeOrder(
    @Param('id') orderId: number,
    @Body() order: Partial<Order>
  ) {
      const or =await Order.findOneById(orderId)
      await Order.merge(or!, order).save()
      return "Succesfully changed new order"

  }

}
