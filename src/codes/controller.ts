import {
    Authorized,
    JsonController,
    Param,
    BadRequestError,
    NotFoundError,
    Get,
    Body,
    HttpCode,
    QueryParam,
    QueryParams

} from 'routing-controllers'



// import { EntityFromQuery } from "typeorm-routing-controllers-extensions";


import { Code } from '../codes/entity'
import { Validate } from 'class-validator'
import { getConnection, getRepository } from "typeorm";



@JsonController()
export default class CodeController {

    @Get('/codes')
    @HttpCode(200)
    getAllCodes() {
        return Code.find()
    }

    // Less important as these should be querried by code not id
    @Get('/codes/:id([0-9]+)')
    @HttpCode(200)
    getCodebyID(
        @Param('id') id: number
    ) {
        return Code.findOneById(id)

    }

//lookup a code
    @Get("/test")
    //@HttpCode(200)
    async getCodebyCode(
        //@Param('code') code: string
        @QueryParam("code") code: string
    )  {
        console.log(code)
        const entities = await getRepository(Code)
                .createQueryBuilder("entity") // Row Alias
                .where("entity.code like :code", { code})
                .getMany()

        console.log(code)

        return entities
    }

}
