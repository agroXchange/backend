import { JsonController, Get, HttpCode, Param } from 'routing-controllers'
import { Currency } from './entity'
const request = require("request")


@JsonController()
export default class currencyController {

  @Get('/currencys')
  @HttpCode(200)
  getAllCurrencyRates() {
    return Currency.find()
  }

  @Get('/currencys/:name')
  @HttpCode(200)
  getOrders(
    @Param('name') name: string
  ) {
    return Currency.findOne({where: {name: name}})
  }

}

//TODO: update the currencyrate
// const currencys = ['USD', 'EUR', 'CRC', 'PAB', 'COP']
// const currencys = ['USD', 'EUR']
// const currencyList = currencys.map(a => {
//   let values = currencys.map(b => {
//     return `${a}_${b}`
//   })
//   return {[a] : values}
// })
// console.log(currencyList[0]['USD'])
// const minutes = 0.1, updateInterval = minutes * 60 * 1000
// let resulting = []
//
// setInterval(function() {
//   console.log("Currencys updated at: " + new Date())
//     for (let i = 0; i < currencys.length; i++) {
//       currencyList[i][currencys[i]].map(convertion => {
//         const url =`https://free.currencyconverterapi.com/api/v5/convert?q=${convertion}&compact=y`;
//         request.get(url, (error, response, body) => {
//           let json = JSON.parse(body)
//           resulting[convertion] = json[convertion].val
//         })
//     })
//     console.log(currencyList[i][currencys[i]], resulting)
//     resulting = []
//   }
//
// }, updateInterval)
