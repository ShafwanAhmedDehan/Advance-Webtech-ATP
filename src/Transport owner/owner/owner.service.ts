import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DriverUpdateDTO,
  EmergencyContact,
  ForgetPassword,
  LoginOwner,
  OtpPasswordDto,
  OwnerUpdateDTO,
  PasswordChangeOwnerDto,
  SignUpOwner,
} from './owner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OwnerEntity } from 'src/owner/owner.entity';
import * as bcrypt from 'bcrypt';
import { DriverEntity } from 'src/driver/driver.entity';
import { addDriver } from 'src/driver/driver.dto';
import { OwnerProfileEntity } from './ownerprofile.entity';
//import MailerService from nodemail modules
import { MailerService } from '@nestjs-modules/mailer/dist';
import { OtpEntity } from 'src/otp.entity';

@Injectable()
export class OwnerService {

  constructor(
    @InjectRepository(OwnerEntity)
    private ownerRepo: Repository<OwnerEntity>,

    @InjectRepository(DriverEntity)
    private driverRepo: Repository<DriverEntity>,

    @InjectRepository(OwnerProfileEntity)
    private ownerProfileRepo: Repository<OwnerProfileEntity>,
  
    private mailerService: MailerService,

    @InjectRepository(OtpEntity)
    private otpRepo: Repository<OtpEntity>,
  ) {}

  async SignUp(data: SignUpOwner): Promise<SignUpOwner> {
    const salt = await bcrypt.genSalt(); // genarate a random number
    data.password = await bcrypt.hash(data.password, salt);
    const owner = await this.ownerRepo.save(data);
    if (owner) {
      await this.ownerProfileRepo.save({
        owner: owner.id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        nid: owner.nid,
        filenames: owner.filenames,
      });
    }

    return this.ownerRepo.save(data);
  }

  async login(loginData: LoginOwner) {
    const userdata = await this.ownerRepo.findOneBy({ email: loginData.email });
    const match: boolean = await bcrypt.compare(
      loginData.password,
      userdata.password,
    );
    
     if (match) {
       return 'Successfully sign in';
     } else {       
       return 'Email and password are incorrect';
       }
     }
  
  async addDriver(driver: addDriver, email: string): Promise<any> {
    const owner = this.ownerRepo.findOneBy({ email: email });
    driver.owner = (await owner).id;
    return this.driverRepo.save(driver);  
  }

  async DriverInfo(email: string): Promise<any> {
    return this.ownerRepo.find({
      where: { email: email },

      relations: {
        drivers: true,
      },
    });
  }


  async Driverdetails(id: number, email: any): Promise<any> {
    const mod = await this.ownerRepo.findOneBy({ email: email });
    console.log(mod.id);

    const res = await this.driverRepo.findOneBy({ id: id, owner: mod.id });
    if (res) {
      return res;
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'No Driver found',
      });
    }
  }


  async updateDriver(
    data: DriverUpdateDTO,
    id: number,
    email: string,
  ): Promise<any> {
    const mod = await this.ownerRepo.findOneBy({ email: email });
    return this.driverRepo.update({ id: id, owner: mod.id }, data);
  }


  async deleteDriver(id: number, email: string): Promise<any> {
    const mod = await this.ownerRepo.findOneBy({ email: email });
    return this.driverRepo.delete({ id: id, owner: mod.id });
  }


  async ownerProfile(email: string): Promise<object> {
    return await this.ownerRepo.findOneBy({ email: email });
  }


  async updateOwner(
    data: OwnerUpdateDTO,

    email: string,
  ): Promise<any> {
    await this.ownerProfileRepo.update({ email: email }, data);
    return this.ownerRepo.update({ email: email }, data);
  }


  async ForgetPassword(email: string) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    function generateString(length) {
      let result = ' ';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength),
        );
      }
      return result;
    }
    const otp = generateString(5).trimStart();
    const owner = await this.ownerRepo.findOneBy({ email: email });

    if (owner) {
      await this.otpRepo.save({
        otp: otp,
        owner: owner.id,
      });
      await this.mailerService.sendMail({
        to: email,
        subject: '',
        text: `Here is your otp: ${otp}`,
      });
    }
  }


  async newPassword(data: OtpPasswordDto) {
    console.log(data.otp);
    const l = await this.otpRepo.find();
    console.log(l);

    const otpMatch = await this.otpRepo.findOneBy({ otp: data.otp });
    console.log(otpMatch);
    if (otpMatch) {
      const owner = await this.ownerRepo.findOneBy({ id: otpMatch.owner });

      const salt = await bcrypt.genSalt();
      owner.password = await bcrypt.hash(data.newPassword, salt);

      return await this.ownerRepo.update(owner.id, owner);
    }
  }
  

  AddEmergency(addemergency: EmergencyContact): object {
    return addemergency;
  }

  async changePassword(
    changedPass: PasswordChangeOwnerDto,
    email: string,
  ): Promise<any> {
    try {
      const owner = await this.ownerRepo.findOneBy({
        email: email,
      });
      const isMatch: boolean = await bcrypt.compare(
        changedPass.oldPassword,
        owner.password,
      );
      console.log(changedPass.oldPassword);

      if (isMatch) {
        const salt = await bcrypt.genSalt();
        owner.password = await bcrypt.hash(changedPass.newPassword, salt);
        const res = await this.ownerRepo.update(owner.id, owner);
        return res;
      } else {
        throw new NotFoundException({});
      }
    } catch (err) {
      throw new NotFoundException({
        message: 'Driver not Matched',
      });
    }
  }
}

