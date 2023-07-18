import { Module } from '@nestjs/common';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { Driver } from './driver.entity';
import { Passenger } from './passenger.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverProfile } from './driverProfile.entity';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Driver, Passenger, DriverProfile]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: 'Mim910306@gmail.com',
          pass: 'bfwondjtzhcadzaj',
        },
      },
    }),
  ],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule {}
