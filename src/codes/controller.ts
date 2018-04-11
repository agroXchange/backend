import {
    Authorized,
    JsonController,
    Param,
    BadRequestError,
    NotFoundError,
    Get,
    Body,
    HttpCode,

} from 'routing-controllers'



import { EntityFromQuery } from "typeorm-routing-controllers-extensions";


import { Code } from '../codes/entity'
import { Validate } from 'class-validator'
import { getConnection } from "typeorm";



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




    @Get("/codes")
    @HttpCode(200)
    get(@EntityFromQuery("code") code: Code) {
        return code;
    }




    // const code = await getConnection()
    //     .createQueryBuilder()
    //     .select()
    //     .from(Code, "user")
    //     .where("code.code = :id", { id: 1 })
    //     .getOne();
}
