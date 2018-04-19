import 'reflect-metadata'
import {Action, BadRequestError, useKoaServer} from "routing-controllers"
import setupDb from './db'
import {secret, verify} from "./jwt"
import * as IO from 'socket.io'
import * as socketIoJwtAuth from 'socketio-jwt-auth'
import * as Koa from 'koa'
import {Server} from 'http'
import {User} from "./users/entity";
import LoginController from "./logins/controller"
import  OrderController  from './orders/controller'
import UserController from "./users/controller"
import CodeController from "./codes/controller"
import ProductController from "./products/controller"
import CurrencyController from "./currencys/controller"
import DashboardController from "./dashboard/controller"
import * as serve from 'koa-static'
import MessageController from "./messages/controller";

const app = new Koa()
const server = new Server(app.callback())
export const io = IO(server)

const port = process.env.PORT || 4008

useKoaServer(app, {
  cors: {
    credentials: true
  },
  controllers: [
    LoginController,
    OrderController,
    UserController,
    CodeController,
    ProductController,
    CurrencyController,
    MessageController,
    DashboardController
  ],
  currentUserChecker: async (action: Action) => {
    const header: string = action.request.headers.authorization
    if (header && header.startsWith('Bearer ')) {
      const [ , token ] = header.split(' ')

      if (token) {
        const {id} = verify(token)
        return User.findOne({where: {id}})
      }
    }
    return undefined
  },
  authorizationChecker: (action: Action) => {
    const header: string = action.request.headers.authorization
    if (header && header.startsWith('Bearer ')) {
      const [ , token ] = header.split(' ')

      try {
        return !!(token && verify(token))
      }
      catch (e) {
        throw new BadRequestError(e)
      }
    }

    return false
  }
})


io.use(socketIoJwtAuth.authenticate({ secret }, async (payload, done) => {
  const user = await User.findOneById(payload.id)
  console.log('test')
  if (user) done(null, user)
  else done(null, false, `Invalid JWT user ID`)
}))

io.on('connect', socket => {
  const name = socket.request.user.profile.name
  console.log(`User ${name} just connected`)
  socket.join(socket.request.user.profile.id)

  socket.on('disconnect', _ => {
    console.log(`User ${name} just disconnected`)
  })
})

app.use(serve('./public'))


setupDb()
  .then(_ => {
    server.listen(port, () => console.log(`Listening on port ${port}`))
  })
  .catch(err => console.error(err))
