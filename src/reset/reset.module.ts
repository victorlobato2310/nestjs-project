import { UserModule } from './../user/user.module';
import { UserService } from './../user/user.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetController } from './reset.controller';
import { Reset } from './reset.entity';
import { ResetService } from './reset.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reset]),
    MailerModule.forRoot({
      transport: {
        host: '0.0.0.0',
        port: 1025
      },
      defaults: {
        from: 'from@example.com'
      }
    }),
    UserModule
  ],
  controllers: [ResetController],
  providers: [ResetService]
})
export class ResetModule {}
