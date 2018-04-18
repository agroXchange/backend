import { JsonController, Get, HttpCode, Param } from 'routing-controllers'
import { Currency } from './entity'
import { currencyKey } from '../mailApiKey'
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

const minutes = 30, updateInterval = minutes * 60 * 1000
setInterval(async function() {
  const currencys = await Currency.find()
  console.log("Currencys updated at: " + new Date())
  currencys.map(currency => {
    const url = `https://data.fixer.io/api/latest?access_key=${currencyKey}&base=${currency.name}&symbols=USD,EUR,CRC,PAB,COP&format=1`
    request(url, (error, response, body) => {
      let json = JSON.parse(body)
      currency.USD = json.rates.USD
      currency.EUR = json.rates.EUR
      currency.CRC = json.rates.CRC
      currency.PAB = json.rates.PAB
      currency.COP = json.rates.COP
      currency.save()
    })
    currency.updated_at = new Date()
    currency.save()
  })
}, updateInterval)
