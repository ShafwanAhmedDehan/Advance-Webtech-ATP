import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from './driver.entity';
import { Repository } from 'typeorm';
import { Passenger } from './passenger.entity';
import { PassengerDto, PassengerUpdateDto } from './passenger.dto';
import {
  DriverChangePass,
  DriverDto,
  DriverLoginDto,
  DriverUpdateDto,
} from './driver.dto';
import * as bcrypt from 'bcrypt';
import { DriverProfile } from './driverProfile.entity';
import { MailerService } from '@nestjs-modules/mailer/dist';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver) private driverRepo: Repository<Driver>,
    @InjectRepository(DriverProfile)
    private driverProfileRepo: Repository<DriverProfile>,
    @InjectRepository(Passenger) private passengerRepo: Repository<Passenger>,
    private mailerService: MailerService,
  ) {}

  async changePassword(data: DriverChangePass, email: string): Promise<any> {
    try {
      const dr = await this.driverRepo.findOneBy({
        email: email,
        password: data.oldPassword,
      });

      const salt = await bcrypt.genSalt();
      dr.password = await bcrypt.hash(data.newPassword, salt);
      return this.driverRepo.update({ email: email }, dr);
    } catch (error) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }
  async deleteDriver(email: string): Promise<any> {
    try {
      await this.driverProfileRepo.delete({ email: email });
      return this.driverRepo.delete({ email: email });
    } catch (error) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }
  getDriver(email: string): any {
    try {
      return this.driverProfileRepo.findOneBy({ email: email });
    } catch (error) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }
  async updateDriver(data: DriverUpdateDto, email: string) {
    try {
      await this.driverProfileRepo.update({ email: email }, data);
      return this.driverRepo.update({ email: email }, data);
    } catch (error) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }
  PassengerDetails(id: number, email: string): any {
    try {
      return this.passengerRepo.find({
        where: { email: email, id: id },
      });
    } catch (error) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }
  async addDriver(dr: DriverDto): Promise<any> {
    try {
      const driver = await this.driverRepo.save(dr);
      if (driver) {
        await this.driverProfileRepo.save({
          name: driver.name,
          phone: driver.phone,
          email: driver.email,
          gender: driver.gender,
          profile: driver.profile,
          driver: driver.id,
        });
      }

      await this.mailerService.sendMail({
        to: driver.email,
        subject: 'Succesfull',
        text: 'You are successfully created the account',
      });
    } catch (error) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }

  async addPassenger(data: PassengerDto, email: string) {
    try {
      const dr = await this.driverProfileRepo.findOneBy({ email: email });
      if (dr) {
        const salt = await bcrypt.genSalt();
        data.password = await bcrypt.hash(data.password, salt);
        return this.passengerRepo.save(data);
      } else {
        return 'Invalid';
      }
    } catch (error) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }

  async deletePassengerByDriver(id: number, email: string): Promise<any> {
    try {
      const dr = await this.driverRepo.findOneBy({ email: email });
      return this.passengerRepo.delete({ id: id, driver: dr.id });
    } catch (error) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }
  async PassengerByDriver(email: string): Promise<any> {
    try {
      return this.driverRepo.find({
        where: { email: email },
        relations: {
          passengers: true,
        },
      });
    } catch (error) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }
  async updatePassengerByDriver(
    id: number,
    data: PassengerUpdateDto,
    email: string,
  ): Promise<any> {
    try {
      const dr = await this.driverRepo.findOneBy({ email: email });
      return this.passengerRepo.update({ id: id, driver: dr.id }, data);
    } catch (error) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }

  async loginDriver(driver: DriverLoginDto): Promise<any> {
    try {
      const dr = await this.driverRepo.findOneBy({ email: driver.email });

      const isMatch = await bcrypt.compare(driver.password, dr.password);
      if (isMatch) return 'Successfully Logged In';
    } catch (error) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }

  async getImages(@Res() res, email: string): Promise<void> {
    const driver = await this.driverRepo.findOneBy({ email: email });

    if (driver) {
      res.sendFile(driver.profile, { root: './uploads' });
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }
}
