import { Body, Controller, Get,UseGuards, Session,Param, Post, Put, Query, Req, UploadedFile, UseInterceptors, UsePipes, ValidationPipe, ParseIntPipe } from "@nestjs/common";
import { PassengerService } from "./Passenger.service";
import { EmergencyContact, ForgetPassword, LoginPassenger, SignUpPassenger, VehicleInfo, studentApplication } from "./Passenger.dto";
import { MulterError, diskStorage } from "multer"
import { FileInterceptor } from "@nestjs/platform-express";
import { relative, resolve } from "path";
import session = require("express-session");
import { SessionGuard } from "./session.guard";

@Controller('Passenger')
export class PassengerController
{
    constructor (private readonly passengerService : PassengerService) {}

    @Post('/login')
    @UsePipes(new ValidationPipe)
    login(@Body() loginData: LoginPassenger, @Session() session) : any
    {
        return this.passengerService.login(loginData, session);
    }

    @Post('/SignUp')
    @UsePipes (new ValidationPipe)
    async SignUp (@Body() signUpData : SignUpPassenger) : Promise<object>
    {
        return this.passengerService.SignUp(signUpData);
    }

    @Post('/Forgetpassword')
    @UsePipes (new ValidationPipe)
    Forgetpassword(@Body() forgetpass : ForgetPassword) : string
    {
        return this.passengerService.Forgetpassword(forgetpass);
    }

    @Post('/StudentApplication')
    @UseGuards(SessionGuard)
    @UsePipes (new ValidationPipe)
    async StudentApplication(@Body() studentApp : studentApplication) : Promise<any>
    {
        return this.passengerService.StudentApplication(studentApp, session);
    }

    @Get('/viewProfile/:phoneNo')
    @UseGuards(SessionGuard)
    viewProfile (@Param() userid: number): any
    {
        return this.passengerService.viewProfile(userid);
    }

    @Get('/SearchInfo')
    @UseGuards(SessionGuard)
    SearchInfo(@Query() searchValue : VehicleInfo): string
    {
        return this.passengerService.SearchInfo(searchValue);
    }

    @Put('/ProfileUpdate/:phoneNO')
    @UseGuards(SessionGuard)
    @UsePipes (new ValidationPipe)
    ProfileUpdate(@Param() phoneNo:string, @Body() newInfo : SignUpPassenger): object
    {
        return this.passengerService.ProfileUpdate(phoneNo,newInfo);
    }

    @Post('/AddEmergency')
    @UseGuards(SessionGuard)
    @UsePipes (new ValidationPipe)
    async AddEmergency(@Body() addemergency : EmergencyContact) : Promise<any>
    {
        return this.passengerService.AddEmergency(addemergency);
    }

    @Post(('/Imageupload/:id'))
    @UseGuards(SessionGuard)
    @UseInterceptors(FileInterceptor('myImage',
    { fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
        cb(null, true);
        else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
        },
        limits: { fileSize: 30000000 },
        storage:diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
        cb(null,Date.now()+file.originalname)
        },
        })
    }
    ))
    async uploadFile(@Param('id') id, @UploadedFile() imageobj: Express.Multer.File) : Promise<object>
    {
        const fileobj = { ppfilename: imageobj.filename, pinfo: id};
        this.passengerService.UploadImage(fileobj);
        return ({message:"Your Profile Picture Uploaded"});
    } 

    @Get('/Displayimage/:id')
    @UseGuards(SessionGuard)
    async Displayimages(@Param('id') id) : Promise<any>
    {
        const fileobject = this.passengerService.ShowImage(id);
        return fileobject;
    }

    @Post('/OTPsend/:UserCredential')
    OTPsend(@Param('UserCredential') UserCredential) : any
    {
        if(!isNaN(UserCredential))
        {
            return this.passengerService.OTPsend(UserCredential);
        }
        else
        {
            return this.passengerService.OTPsendemail(UserCredential);
        }
    }

    @Get('/PaymentHistory/:id')
    @UseGuards(SessionGuard)
    PaymentHistory(@Param('id', ParseIntPipe) id) : any
    {
        const payHistory = this.passengerService.showPaymentHistory(id);
        return payHistory;
    }
}