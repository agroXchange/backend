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
  HeaderParam
} from 'routing-controllers'
import { Order } from './entity'
import { Product } from '../products/entity'
import { Validate } from 'class-validator'
import * as request from 'superagent'


@JsonController()
export default class orderController {

  @Get('/products')
  @HttpCode(200)
  getProducts() {
    return Product.find()
  }

  @Get('/products/:id([0-9]+)')
  @HttpCode(200)
  getOrderbyID(
    @Param('id') id: number
  ) {
    const product = Product.findOneById(id)
    return product
  }

  @Post('/:id([0-9]+)/products')
  @HttpCode(200)
  async addProduct(
    @Param('id') sellerId: number,
    @Body() order: Product
  ) {
    const group: any = await Seller.findOneById(sellerId)
    await Product.create({
    name: product.name,
    photo: product.photo,
    volume: product.volume,
    price: product.price,
    destination: .ICO,

    }).save()
    return "Succesfully added new product"

  }
