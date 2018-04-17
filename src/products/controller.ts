import {
  Authorized,
  JsonController,
  Param,
  BadRequestError,
  Get,
  Body,
  HttpCode,
  Post,
  UploadedFile,
  CurrentUser,
  QueryParam,
  Patch
} from 'routing-controllers'

import { Code } from '../codes/entity'
import { Product } from '../products/entity'
import { Validate } from 'class-validator'
import {User} from '../users/entity'
import { Profile } from '../profiles/entity'
import {FILE_UPLOAD_OPTIONS} from '../uploadConfig'
import { getConnection, getRepository } from 'typeorm'
import {baseUrl} from "../constants";

@JsonController()
export default class ProductController {

  @Authorized()
  @Get('/profiles/:id([0-9]+)/products')
  @HttpCode(200)
  async getProducts(
    @Param('id') id: number,
    @CurrentUser() currentUser: User
  ) {
      const profile = await Profile.findOneById(id)
      if(!profile) throw new BadRequestError("no user")

      const products = await Product.find({
        where: {seller: profile}
      })

      if(!(currentUser.id === profile.id) && !(currentUser.role === 'admin')){
          return products.filter(product =>
            (new Date(product.expiration) > new Date())
            && product.volume > 0
          )}
          return products
        }

@Get('/search/products')
@HttpCode(200)
async searchProducts(
  @QueryParam("code") code: string,
  @QueryParam("country") country: string
    //@Body() {country, code}
)

{
  console.log(code)
  console.log(country)
  if (country && code){
    const list = await getRepository(Product)
    .createQueryBuilder("product")
      .innerJoinAndSelect("product.seller", "profile")
    .where("profile.country = :country", {country: country})
      .innerJoinAndSelect("product.code", "code")
    .andWhere("code.code = :code", {code: code})
    .getMany()
    console.log("cc" + list)
    return list.filter(product =>
      (new Date(product.expiration) > new Date())
      && product.volume > 0
    )
  }
  if (!country){
    const list = await getRepository(Product)
    .createQueryBuilder("product")
      .innerJoinAndSelect("product.code", "code")
    .where("code.code = :code", {code: code})
      .innerJoinAndSelect("product.seller", "profile")
    .getMany()
    console.log("code" + list  )
    return list.filter(product =>
      (new Date(product.expiration) > new Date())
      && product.volume > 0
    )
  }
  if (!code){
    const list = await getRepository(Product)
    .createQueryBuilder("product")
      .innerJoinAndSelect("product.seller", "profile")
    .where("profile.country = :country", {country: country})
    .innerJoinAndSelect("product.code", "code")
    .getMany()
    console.log("country" + list)
    return list.filter(product =>
      (new Date(product.expiration) > new Date())
      && product.volume > 0
    )
  }

  else {
    return Product.find()
  }
    }

  @Get('/products')
  @HttpCode(200)
  getAllProducts(
  ) {
      return Product.find()
  }

  @Authorized()
  @Get('/products/:id([0-9]+)')
  @HttpCode(200)

  getProductID(
    @CurrentUser() currentUser: User,
    @Param('id') id: number
  ) {
    const product = Product.findOneById(id)
    return product
  }

  @Authorized()
  @Post('/products')
  @HttpCode(200)
  async addProduct(
    @Body() product: Partial <Product>,
    @CurrentUser() currentUser: User,
    @UploadedFile('productPhoto', {options: FILE_UPLOAD_OPTIONS}) file: any
  ) {
    const code = await Code.findOne({
      where: {code: product.code}
    })

    if(!currentUser.profile) throw new BadRequestError("Profile doesn't exist.")

    const test = await Product.create({
      photo: baseUrl + file.path.substring(6, file.path.length),
      volume: product.volume,
      price: product.price,
      description: product.description,
      expiration: product.expiration,
      currency: product.currency,
      harvested: product.harvested,
      certificate: product.certificate,
      seller: currentUser.profile,
      code: code
    }).save()
    return "Succesfully added new product"
  }

  @Authorized()
  @Patch('/products/:id([0-9]+)')
  async changeProduct(
    @CurrentUser() currentUser: User,
    @Param('id') id: number,
    @Body() updates: Partial<Product>
  ) {
    const product = await Product.findOneById(id)
    if(!product) throw new BadRequestError("Product doesn't exist.")

    if (!(product.seller.id === currentUser.id)) throw new
    BadRequestError('You are not authorized to change this product.')
    const changedProduct = await Product.merge(product, updates).save()
    return changedProduct
  }
}
