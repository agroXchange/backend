import {Authorized, BadRequestError, Body, CurrentUser, Get, JsonController, Param, Post} from "routing-controllers";
import {Profile} from "../profiles/entity";
import {IsEmail, IsString, MinLength} from "class-validator";
import {User} from "./entity";

class ValidateSignupPayload extends Profile {

  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  password: string

}

@JsonController()
export default class UserController {

  @Authorized()
  @Get('/users/:id([0-9]+)')
  getUser(
    @Param('id') id: number,
    @CurrentUser() currentUser: User
  ) {
    if(currentUser.id === id) {
      return User.find({
        where: {id},
        relations: ['products', 'orders', 'profile']
      })
    }

    return User.find({
      where: {id},
      relations: ['products', 'orders']
    })
  }

  @Authorized()
  @Get('/users')
  getAllUsers(
    @CurrentUser() currentUser: User
  ) {
    if(!(currentUser.role === 'admin')) throw new BadRequestError('You are not authorized to use this route.')

    return User.find()
  }

  @Post('/users')
  async createUser(
    @Body() body: ValidateSignupPayload
  ) {
    const {email, password, ...profile} = body

    const profileEntity = await Profile.create(profile).save()
    const userEntity = User.create({email, approved: true})

    await userEntity.setPassword(password)
    userEntity.profile = profileEntity

    return userEntity.save()
  }

}
