import {
  Authorized,
  JsonController,
  Get,
  HttpCode,
  CurrentUser
} from 'routing-controllers'
import { Order } from '../orders/entity'
import { User } from '../users/entity'
import { Product } from '../products/entity'

@JsonController()
export default class dashboardController {

  @Authorized()
  @Get('/dashboard')
  @HttpCode(200)
  async getDashboard(
    @CurrentUser() currentUser: User
  ) {
      const seller = currentUser!.profile
      const orders =  await Order.findAndCount({
        where: {seller}
      })
      const products = await Product.find({
        where: {seller}
      })
      return {
        orders: orders.length,
        products: products.length
      }
    }

}
