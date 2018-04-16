import {
  Authorized, BadRequestError, Body, CurrentUser, Get, JsonController, Param, Post, Patch, Delete, NotFoundError,
  UnauthorizedError, UploadedFile
} from "routing-controllers";
import {Profile} from "../profiles/entity";
import {IsEmail, IsString, MinLength} from "class-validator";
import {User} from "./entity";
import {sendSignUpMail, approvedMail} from "../mails/templates";
import {FILE_UPLOAD_OPTIONS} from "../uploadConfig";
import {baseUrl} from "../constants";

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
  async getUser(
    @Param('id') id: number
  ) {
    return User.findOneById(id)
  }

  @Authorized()
  @Get('/admin/users/pending')
  async getPendingUsers(
    @CurrentUser() currentUser: User
  ) {
    if(!(currentUser.role === 'admin')) throw new BadRequestError('You are not authorized to use this route.')
    const users = await User.find()
    if (!users) throw new NotFoundError(`No Users so far!`)
    const unapprovedUsers = users.filter(users => users.approved === false)
    return unapprovedUsers
  }

  @Authorized()
  @Patch('/admin/users/:id')
  async changeUserInformation(
    @CurrentUser() currentUser: User,
    @Param('id') id: number,
    @Body() updates: Partial<Profile>
  ) {
    if(!(currentUser.role === 'admin')) throw new BadRequestError('You are not authorized to use this route.')
    const profile = await Profile.findOneById(id)
    if (!profile) throw new NotFoundError(`User does not exist!`)
    const changedUser = await Profile.merge(profile, updates).save()
    return changedUser
  }

  @Authorized()
  @Patch('/admin/users/:id/approve')
  async approveUser(
    @CurrentUser() currentUser: User,
    @Param('id') id: number,
  ) {
    if(!(currentUser.role === 'admin')) throw new BadRequestError('You are not authorized to use this route.')
    const user = await User.findOneById(id)
    if (!user) throw new NotFoundError(`User does not exist!`)
    user!.approved = true

    await approvedMail(user.email, user.profile.name)

    return user!.save()
  }

  @Authorized()
  @Delete('/admin/users/:id')
  async deleteUser(
    @CurrentUser() currentUser: User,
    @Param('id') id: number,
  ) {
    if(!(currentUser.role === 'admin')) throw new BadRequestError('You are not authorized to use this route.')
    const user = await User.findOneById(id)
    if (!user) throw new NotFoundError(`User does not exist!`)
    await user.remove()
    return {
      message: "You succesfully deleted the user!"
    }
  }

  @Authorized()
  @Get('/users')
  async getAllUsers(
    @CurrentUser() currentUser: User
  ) {
    if(!(currentUser.role === 'admin')) throw new BadRequestError('You are not authorized to use this route.')
    const users = await User.find()
    return users.filter(user => user.role !== 'admin')
  }

  @Authorized()
  @Patch('/users/:id/logo')
  async updateUser(
    @CurrentUser() currentUser: User,
    @Param('id') id: number,
    @UploadedFile('logo', {options: FILE_UPLOAD_OPTIONS}) file: any
  ) {
    if (!(currentUser.id === id)) throw new UnauthorizedError("You're not authorized to do this.")

    const user = await User.findOneById(id)
    if (!user) throw new NotFoundError('Somehow no user was found.')

    const profile = await Profile.findOneById(user.profile.id)
    if (!profile) throw new NotFoundError('No profile for this user.')

    profile.logo = baseUrl + file.path.substring(6, file.path.length)

    await profile.save()

    return { message: 'Successfully added a profile picture.'}
  }

  @Post('/users')
  async createUser(
    @Body() body: ValidateSignupPayload
  ) {
    const {email, password, ...profile} = body

    const profileEntity = await Profile.create({...profile, email}).save()
    const userEntity = User.create({email, approved: true})

    await userEntity.setPassword(password)
    userEntity.profile = profileEntity

    const user =  userEntity.save()

    await sendSignUpMail(email, profile.name)

    return user
  }

}
