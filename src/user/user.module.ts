import { Token } from './token.entity';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([User, Token]),
        JwtModule.register({
            secret: 'secret',
            signOptions: { expiresIn: '1w' },
        })
    ],
    controllers: [UserController],
    providers: [UserService, TokenService],
    exports: [UserService]
})
export class UserModule {}
