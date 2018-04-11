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
  UploadedFile
} from 'routing-controllers'
import { Order } from '../orders/entity'
import { Code } from '../codes/entity'
import { Product } from '../products/entity'
import { Validate } from 'class-validator'
import { User } from '../users/entity'
import * as request from 'superagent'
import {FILE_UPLOAD_OPTIONS} from '../uploadConfig'


@JsonController()
export default class ProductController {

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
    @Body() product: Product,
    @UploadedFile('productPhoto', {options: FILE_UPLOAD_OPTIONS}) file: any
  ) {
    const user = await User.findOneById(sellerId)

    if(!user) throw new BadRequestError("User doesn't exist.")

    await Product.create({
    name: product.name,
    photo: `http://localhost:4008/${file.path}`,
    volume: product.volume,
    price: product.price,
    description: product.description,
    expiration: product.expiration,
    currency: product.currency,
    harvested: product.harvested,
    certificate: product.certificate,
    user: user

    }).save()
    return "Succesfully added new product";

  }
}
