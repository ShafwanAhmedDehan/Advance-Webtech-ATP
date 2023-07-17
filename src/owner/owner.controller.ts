import {
  Body,
  ParseIntPipe,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Session,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { OwnerService } from './owner.service';
import {
  DriverUpdateDTO,
  EmergencyContact,
  ForgetPassword,
  LoginOwner,
  OtpPasswordDto,
  OwnerUpdateDTO,
  PasswordChangeOwnerDto,
  SentMailOwnerDto,
  SignUpOwner,
} from './owner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import session from 'express-session';
import { addDriver } from 'src/driver/driver.dto';
import { SessionGuard } from 'src/session.gurd';
import { DriverInfo } from 'typeorm';

@Controller('owner')
export class OwnerController {
  adminService: any;
  constructor(private readonly ownerService: OwnerService) {}

  @Post('/SignUp')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
          cb(null, true);
        else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 3000000 },
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe())
  SignUp(
    @Body() signUpData: SignUpOwner,
    @UploadedFile() imageobj: Express.Multer.File,
  ): Promise<SignUpOwner> {
    console.log(signUpData);
    console.log(imageobj.filename);
    signUpData.filenames = imageobj.filename;
    return this.ownerService.SignUp(signUpData);
  }


  @Post('/login')
  @UsePipes(new ValidationPipe())
  login(@Body() loginData: LoginOwner, @Session() session) {
    const result = this.ownerService.login(loginData);
    if (result) {
      session.email = loginData.email;
      console.log(session.email);
    }
    return result;
  }


  @Post('/addDriver')
  @UsePipes(new ValidationPipe())
  @UseGuards(SessionGuard)
  addDriver(@Session() session, @Body() driver: addDriver): any {
    console.log(driver);
    return this.ownerService.addDriver(driver, session.email);
  }


  @Get('/Driver')
  @UseGuards(SessionGuard)
  DriverInfo(@Session() session): any {
    return this.ownerService.DriverInfo(session.email);
  }


  @Get('/driver/:id')
  @UseGuards(SessionGuard)
  Driver(@Param('id', ParseIntPipe) id: number, @Session() session): object {
    return this.ownerService.Driverdetails(id, session.email);
  }


  @Put('/updatedriver/:id')
  @UseGuards(SessionGuard)
  @UsePipes(new ValidationPipe())
  updateDriver(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: DriverUpdateDTO,
    @Session() session,
  ): object {
    return this.ownerService.updateDriver(data, id, session.email);
  }


  @Delete('/driver/:id')
  @UseGuards(SessionGuard)
  deleteDriver(
    @Param('id', ParseIntPipe) id: number,
    @Session() session,
  ): object {
    return this.ownerService.deleteDriver(id, session.email);
  }


  @Get('/ownerProfile')
  ownerProfile(@Session() session): any {
    return this.ownerService.ownerProfile(session.email);
  }


  @Put('/updateowner')
  @UseGuards(SessionGuard)
  @UsePipes(new ValidationPipe())
  updateowner(@Body() data: OwnerUpdateDTO, @Session() session): object {
    return this.ownerService.updateOwner(data, session.email);
  }


  @Get('/logout')
  @UseGuards(SessionGuard)
  moderatorLogout(@Session() session): any {
    if (session.destroy()) {
      return true;
    } else {
      return false;
    }
  }


  @Post('/changePassword')
  @UseGuards(SessionGuard)
  @UsePipes(new ValidationPipe())
  changePassword(
    @Body() changedPass: PasswordChangeOwnerDto,
    @Session() session,
  ): any {
    return this.ownerService.changePassword(changedPass, session.email);
  }


  @Post('/sentmail')
  @UsePipes(new ValidationPipe())
  sentMail(@Body() data: SentMailOwnerDto): any {
    return this.ownerService.ForgetPassword(data.email);
  }


  @Patch('/forgetPassword')
  @UsePipes(new ValidationPipe())
  forgetPass(@Body() data: OtpPasswordDto): any {
    return this.ownerService.newPassword(data);
  }


  @Post('/AddEmergency')
  @UsePipes(new ValidationPipe())
  AddEmergency(@Body() addemergency: EmergencyContact): any {
    return this.ownerService.AddEmergency(addemergency);
  }


  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('myfile', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
          cb(null, true);
        else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 30000 },
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() myfileobj: Express.Multer.File): object {
    console.log(myfileobj);
    return { message: 'file uploaded' };
  }

  
  @Get('/getimage/:name')
  getImages(@Param('name') name, @Res() res) {
    res.sendFile(name, { root: './uploads' });
  }
}
