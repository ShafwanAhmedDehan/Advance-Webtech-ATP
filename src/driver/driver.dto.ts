import { IsEmail, IsNotEmpty, IsNumberString, Matches } from "class-validator";

export class addDriver {
  @IsNotEmpty({ message: 'Please Enter Name' })
  @Matches(/^[A-Za-z\s]*$/, { message: 'Invaild Name' })
  name: string;
  @IsNotEmpty({ message: 'Please Enter Email' })
  @IsEmail(undefined, { message: 'Enter a Valid Email Address' })
  email: string;

  @IsNotEmpty({ message: 'Please Enter Phone No' })
  @IsNumberString(undefined, { message: 'Enter Valid Phone No.' })
  @Matches(/(^(\+8801|8801|01))[1|3-9]{1}(\d){8}$/, {
    message: 'Invaild Phone no [Use BD Convention]',
  })
  phone: string;
    licenseNo: string;
    owner: number;
}
