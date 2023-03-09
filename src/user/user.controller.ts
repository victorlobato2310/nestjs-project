import { UserService } from './user.service';
import { Body, Controller, Post } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import * as bycryptjs from 'bcryptjs';
@Controller('user')
export class UserController {

    constructor(
        private userService: UserService
    ){}


    @Post('register')
    async register(@Body() body: any){
        if(body.password !== body.password_confirm){
            throw new BadRequestException('Passwords do not match!');
        }
        return await this.userService.save({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: await bycryptjs.hash(body.password, 12)
        });
    }


    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') passowrd: string
    ){
        const user = await this.userService.findOne({ email });

        if(!user){
            throw new BadRequestException('invalid credentials!');
        }

        if(!await bycryptjs.compare(passowrd, user.password)){
            throw new BadRequestException('invalid credentials!');
        }

        return user;
    }
}
