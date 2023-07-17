import { Module } from '@nestjs/common';
import { OwnerController } from './owner.controller';
import { OwnerService } from './owner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerEntity } from 'src/owner/owner.entity';
import { DriverEntity } from '../driver/driver.entity';
import { OwnerProfileEntity } from './ownerprofile.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { OtpEntity } from 'src/otp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OwnerEntity,
      DriverEntity,
      OwnerProfileEntity,
      OtpEntity,
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',

        port: 465,

        ignoreTLS: true,

        secure: true,

        auth: {
          user: 'prantosen56@gmail.com',

          pass: 'npikwnydzcpewtvd',
        },
      },
    }),
  ],
  controllers: [OwnerController],
  providers: [OwnerService],
})
export class OwnerModule {}
