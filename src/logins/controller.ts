import {BadRequestError, Body, JsonController, NotFoundError, Post} from "routing-controllers";
import {IsEmail, IsString} from "class-validator";
import {User} from "../users/entity";
import {sign} from "../jwt";

class AuthenticatePayload {

  @IsEmail()
  email: string

  @IsString()
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
    return {jwt}
  }

}
