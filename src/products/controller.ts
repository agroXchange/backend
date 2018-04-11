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
import { Profile } from '../profiles/entity'
import {FILE_UPLOAD_OPTIONS} from '../uploadConfig'


@JsonController()
export default class ProductController {

  //@Authorized() //TODO: activate once testing is over
  @Get('/products')
  @HttpCode(200)
  getProducts() {
    return Product.find()
  }

  //@Authorized() //TODO: activate once testing is over
  @Get('/products/:id([0-9]+)')
  @HttpCode(200)
  getOrderbyID(
    @Param('id') id: number
  ) {
    const product = Product.findOneById(id)
    return product
  }

  //@Authorized() //TODO: activate once testing is over
  @Post('/:id([0-9]+)/products')
  @HttpCode(200)
  async addProduct(
    @Param('id') sellerId: number,
    @Body() product: Product,
    @UploadedFile('productPhoto', {options: FILE_UPLOAD_OPTIONS}) file: any
  ) {

    const profile = await Profile.findOneById(sellerId)
    const code = await Code.findOneById(product.code)

    if(!profile) throw new BadRequestError("Profile doesn't exist.")

    await Product.create({
    name: product.name,
    photo: `http://localhost:4008${file.path.substring(6, file.path.length)}`,
    volume: product.volume,
    price: product.price,
    description: product.description,
    expiration: product.expiration,
    currency: product.currency,
    harvested: product.harvested,
    certificate: product.certificate,
    seller: profile,

    }).save()
    return "Succesfully added new product";

  }
}
