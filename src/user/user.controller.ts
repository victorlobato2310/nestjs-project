import { UserService } from './user.service';
import { Body, Controller, Post, Get } from '@nestjs/common';
import { BadRequestException, UnauthorizedException } from '@nestjs/common/exceptions';
import * as bycryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt/dist';
import { Request, Response } from 'express';
import { Req, Res } from '@nestjs/common/decorators';

@Controller()
export class UserController {

    constructor(
        private userService: UserService,
        private jwtService: JwtService
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
        @Body('password') passowrd: string,
        @Res({ passthrough: true}) response: Response
    ){
        const user = await this.userService.findOne({ email });

        if(!user){
            throw new BadRequestException('invalid credentials!');
        }

        if(!await bycryptjs.compare(passowrd, user.password)){
            throw new BadRequestException('invalid credentials!');
        }

        const accessToken = await this.jwtService.signAsync({
            id: user.id
        }, { expiresIn: '30s' });
        
        const refreshToken = await this.jwtService.signAsync({
            id: user.id
        });

        response.status(200);
        response.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
        })

        return {
            token: accessToken
        }
    }

    @Get('user')
    async user(
        @Req() request: Request
    ){
        try {
            const accessToken = request.headers.authorization.replace('Bearer ', '');
            const { id } = await this.jwtService.verifyAsync(accessToken);
            const { password, ...data } = await this.userService.findOne(id);
            
            return data;
        } catch (e) {
            throw new UnauthorizedException();
        }
    }

    @Post('refresh')
    async refresh(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response
    ){
        try {
            const refreshToken = request.cookies['refresh_token'];

            const { id } = await this.jwtService.verifyAsync(refreshToken);

            const token = await this.jwtService.signAsync({ id }, { expiresIn: '30s' });
            
            response.status(200);

            return {
                token
            }
        } catch (e) {
            throw new UnauthorizedException();
        }
    }
}
