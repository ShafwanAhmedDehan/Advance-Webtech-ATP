import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Res,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { DriverService } from './driver.service';
import { PassengerDto, PassengerUpdateDto } from './passenger.dto';
import {
  DriverChangePass,
  DriverDto,
  DriverLoginDto,
  DriverUpdateDto,
} from './driver.dto';
import { SessionGuard } from './sessio.guards';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post('/Register')
  @UseInterceptors(
    FileInterceptor('myfile', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
          cb(null, true);
        else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 2000000 },
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  adddriver(
    @Body()
    dr: DriverDto,
    @UploadedFile() myfileobj: Express.Multer.File,
  ): any {
    dr.profile = myfileobj.filename;
    return this.driverService.addDriver(dr);
  }

  @Put('/update')
  @UseGuards(SessionGuard)
  updateDriver(@Body() data: DriverUpdateDto, @Session() session) {
    return this.driverService.updateDriver(data, session.email);
  }
  @Get('/Driver')
  @UseGuards(SessionGuard)
  getDriver(@Session() session): any {
    return this.driverService.getDriver(session.email);
  }

  @Delete('/driver')
  deleteDriver(@Session() session): any {
    return this.driverService.deleteDriver(session.email);
  }

  @Post('/createPassenger')
  @UseGuards(SessionGuard)
  addJob(@Session() session, @Body() data: PassengerDto) {
    return this.driverService.addPassenger(data, session.email);
  }
  @Get('/PassengerByDriver')
  PassengerByDriver(@Session() session): any {
    return this.driverService.PassengerByDriver(session.email);
  }

  @Get('/PassengerByDriver/:id')
  PassengerByDriverId(
    @Param('id', ParseIntPipe) id: number,
    @Session() session,
  ): any {
    return this.driverService.PassengerDetails(id, session.email);
  }

  @Delete('/PassengerByDriver/:id')
  deletePassengerByDriver(
    @Param('id', ParseIntPipe) id: number,
    @Session() session,
  ): any {
    return this.driverService.deletePassengerByDriver(id, session.email);
  }

  @Put('/PassengerByDriver/:id')
  updatePassengerByDriver(
    @Body() data: PassengerUpdateDto,
    @Param('id', ParseIntPipe) id: number,
    @Session() session,
  ) {
    return this.driverService.updatePassengerByDriver(id, data, session.email);
  }

  @Post('/login')
  loginDriver(driver: DriverLoginDto, @Session() session): any {
    session.email = driver.email;
    return this.driverService.loginDriver(driver);
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

  @Put('/changePassword')
  @UseGuards(SessionGuard)
  changePassword(@Body() data: DriverChangePass, @Session() session) {
    return this.driverService.changePassword(data, session.email);
  }

  @Get('/getimage')
  @UseGuards(SessionGuard)
  async getting(@Res() res, @Session() session): Promise<any> {
    await this.driverService.getImages(res, session.email);
  }
}
