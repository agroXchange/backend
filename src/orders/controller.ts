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

  // @Authorized()
  @Get('/orders')
  async getUser(
    @CurrentUser() currentUser: User
  ) {
    const buyer = currentUser
    return Order.find({where: {buyer}})
  }

 @Authorized()
  @Get('/admin/profiles/:id/orders')
  @HttpCode(200)
  async getOrdersbyUserId(
    @Param('id') id: number,
    @CurrentUser() currentUser: User
  ) {
    if(!(currentUser.role === 'admin')) throw new BadRequestError('You are not authorized to use this route.')
    const profile = await Profile.findOneById(id)
    if(!profile) throw new BadRequestError("no user")
    return Order.find({
    where: {buyer: profile}
  })
}

  //@Authorized() //TODO: activate once testing is over
  @Post('/products/:id([0-9]+)/orders')
  @HttpCode(200)
  async addOrder(
    @Param('id') productId: number,
    @CurrentUser() currentUser: User,
    @Body() order: Partial<Order>
  ) {
    const buyer = currentUser.profile
    const product = await Product.findOneById(productId)
    const newOrder=  await Order.create({
      volume: order.volume,
      comments: order.comments,
      date: new Date(),
      ICO: order.ICO,
      buyer: buyer,
      product: product,
      }).save()

    return newOrder
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
    @Body() updates: Partial<Order>
  ) {
      const order = await Order.findOneById(orderId)
      if(!(order!.status === 'Pending')) throw new BadRequestError('You are not allow to do this.')
      await Order.merge(order!, updates).save()
      const updatedOrder = await Order.findOne({
        where: {orderId},
        relations: ['buyer']
      })
      return updatedOrder
  }
}
