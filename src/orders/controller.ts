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

  @Authorized()
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
    @Body() order: Order
  ) {
    const group: any = await Product.findOneById(productId)
    await Order.create({
    volume: order.volume,
    comments: order.comments,
    date: new Date(),
    ICO: order.ICO,
    }).save()
    return "Succesfully added new order"
  }

  @Authorized() //TODO: activate once testing is over
  @Delete('/orders/:id')
  async deleteOrder(
    @CurrentUser() currentUser: User,
    @Param('id') id: number,
  ) {
    const usersOrders = await Order.find({where: {buyer : currentUser.profile}})
    return usersOrders.map(async order => {
      if (order.id === id && order.status === 'Pending') {
        await order.remove()
        return { message: 'You succesfully deleted the Order!'}
      }
      else if (order.id === id && order.status === 'Pending') {
        await order.remove()
        return { message: 'You succesfully deleted the Order!'}
      }
      else {
        return { message: 'You are not allowed to delete this Order. Please contact us!'}
      }
    })
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
