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
  CurrentUser, QueryParam

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
    const buyer = currentUser.profile
    return Order.find({where: {buyer}})
  }


  //@Authorized()
  @Get('/orders/received')
  async getSeller(
    @CurrentUser() currentUser: User,
    @QueryParam('unseen') unseen: string

  ) {
    const seller = currentUser.profile

    if (unseen === 'true') {
      return Order.find({where: {seller, seen: false}, relations: ['buyer']})
    }

    return Order.find({where: {seller}, relations: ['buyer']})
  }

  //@Authorized() //TODO: activate once testing is over
  @Get('/orders/:id([0-9]+)')
  @HttpCode(200)
  async getOrderbyID(
    @Param('id') id: number,
    @CurrentUser() currentUser: User
  ) {
    const order = await Order.findOne({
      where: {id},
      relations: ['buyer']
    })
    if(!order) throw new NotFoundError('No order found.')
    if (currentUser.role === 'admin') return order

    if (currentUser.profile.id === order.seller.id && !order.seen) {
      order.seen = true
      await order.save()
    }
    return order
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
    if (!product) throw new NotFoundError('No order found.')
    const newOrder=  await Order.create({
      volume: order.volume,
      comments: order.comments,
      date: new Date(),
      ICO: order.ICO,
      buyer: buyer,
      seller: product.seller,
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
      if (!order) throw new NotFoundError('No order found.')
      if (order!.status === 'Pending' && updates.status === 'Approved' || updates.status === 'Declined')  {
      await Order.merge(order!, updates).save()
      var updatedOrder = await Order.findOne({
        where: {orderId},
        relations: ['buyer']
      })}

      else if (order!.status === 'Approved' && updates.status==='Purchased') {
        await Order.merge(order!, updates).save()
        var updatedOrder = await Order.findOne({
          where: {orderId},
          relations: ['buyer']
        })
        const product = await Product.findOneById(order.product.id)
        if (!product) throw new NotFoundError('No product found.')
      product!.volume -= order.volume
    product.save()}

      return updatedOrder
  }
}
