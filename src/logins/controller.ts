import {
  BadRequestError, Body, HeaderParam, JsonController, NotFoundError, Post,
  UnauthorizedError
} from "routing-controllers";
import {IsEmail, IsString, MinLength} from "class-validator";
import {User} from "../users/entity";
import {sign, signPasswordToken, verifyPasswordToken} from "../jwt";
import {sendResetPasswordLink} from "../mails/templates";
import * as jwt from 'jsonwebtoken'

class AuthenticatePayload {

  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  password: string

}

@JsonController()
export default class LoginController {

  @Post('/logins')
  async authenticate(
    @Body() {email, password}: AuthenticatePayload
  ) {
    const user = await User.findOne({where: {email}})

    if(!user) throw new NotFoundError('No user with that email found.')
    if(!await user.checkPassword(password)) throw new BadRequestError('Incorrect password.')
    if(!user.approved) throw new BadRequestError("Your profile isn't approved yet.")

    const jwt = sign({id: user.id!})
    return {
      jwt,
      id: user.id
    }
  }

  @Post('/forgotpassword')
  async sendToken(
    @Body() {email}: Partial<AuthenticatePayload>
  ) {
    const user = await User.findOne({where: {email}})
    if(!user) throw new NotFoundError('No user with that email found.')

    const passwordToken = signPasswordToken({id: user.id!}, user.updatedAt.toISOString())

    try {
      await sendResetPasswordLink(user.email, passwordToken)
    } catch(err) {
      return { message: err.message }
    }

    return { message: 'Successfully sent password reset link.' }

  }

  @Post('/resetpassword')
  async resetPassword(
    @Body() {password}: Partial<AuthenticatePayload>,
    @HeaderParam("Authorization") almostToken: string
  ) {
    if(!almostToken.startsWith("Bearer ")) throw new UnauthorizedError('Invalid auth header.')
    const token = almostToken.split(" ")[1]
    console.log(token)
    const payload = jwt.decode(token)
    console.log(payload)
    const user = await User.findOneById(payload.id)
    if(!user) throw new BadRequestError('No user found.')

    if(!!(password && verifyPasswordToken(token, user.updatedAt.toISOString()))) {
      await user.setPassword(password)
      user.updatedAt = new Date()
      await user.save()

      return { message: "Successfully reset your password."}
    }

  }

}
