import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class LoginOwner {
  @IsEmail({}, { message: 'invalid email' })
  email: string;
  @MinLength(8, { message: 'Password should be 8 character' })
  password: string;
}

export class SignUpOwner {
  @IsString({ message: 'Invaild Input Data Type' })
  @IsNotEmpty({ message: 'Please Enter Name' })
  @Matches(/^[A-Za-z\s]*$/, { message: 'Invaild Name' })
  name: string;

  @IsString({ message: 'Invaild Input Data Type' })
  @IsNotEmpty({ message: 'Please Enter Email' })
  @IsEmail(undefined, { message: 'Enter a Valid Email Address' })
  email: string;

  @IsString({ message: 'Invaild Input Data Type' })
  @IsNotEmpty({ message: 'Please Enter Phone No' })
  @IsNumberString(undefined, { message: 'Enter Valid Phone No.' })
  @Matches(/(^(\+8801|8801|01))[1|3-9]{1}(\d){8}$/, {
    message: 'Invaild Phone no [Use BD Convention]',
  })
  phone: string;

  @IsString({ message: 'Invaild Input Data Type' })
  @IsNotEmpty({ message: 'Please Enter NID' })
  @IsNumberString(undefined, { message: 'Enter Valid NID No.' })
  nid: string;

  @IsString({ message: 'Invaild Input Data Type' })
  @IsNotEmpty({ message: 'Please Enter Password' })
  @MinLength(8, { message: 'Password is Too Short' })
  password: string;
  filenames: string;
}

export class ForgetPassword {
  @IsString({ message: 'Invaild Input Data Type' })
  @IsNotEmpty({ message: 'Please Enter Phone No' })
  @Matches(/(^(\+8801|8801|01))[1|3-9]{1}(\d){8}$/, {
    message: 'Invaild Phone no [Use BD Convention]',
  })
  phone: string;

  @IsString({ message: 'Invaild Input Data Type' })
  @IsNotEmpty({ message: 'Please Enter Password' })
  @MinLength(8, { message: 'Password is Too Short' })
  newpassword: string;

  @IsString({ message: 'Invaild Input Data Type' })
  @IsNotEmpty({ message: 'Please Enter Password' })
  @MinLength(8, { message: 'Password is Too Short' })
  confirmpassword: string;
}

export class OwnerUpdateDTO {
  @IsString({ message: 'Invaild Input Data Type' })
  @IsNotEmpty({ message: 'Please Enter Name' })
  @Matches(/^[A-Za-z\s]*$/, { message: 'Invaild Name' })
  name: string;

  @IsString({ message: 'Invaild Input Data Type' })
  @IsNotEmpty({ message: 'Please Enter Email' })
  @IsEmail(undefined, { message: 'Enter a Valid Email Address' })
  email: string;

  @IsString({ message: 'Invaild Input Data Type' })
  @IsNotEmpty({ message: 'Please Enter Phone No' })
  @Matches(/(^(\+8801|8801|01))[1|3-9]{1}(\d){8}$/, {
    message: 'Invaild Phone no [Use BD Convention]',
  })
  phone: string;
  nid: string;
}

export class DriverUpdateDTO {
  @IsString({ message: 'Invaild Input Data Type' })
  @IsNotEmpty({ message: 'Please Enter Name' })
  @Matches(/^[A-Za-z\s]*$/, { message: 'Invaild Name' })
  name: string;

  @IsString({ message: 'Invaild Input Data Type' })
  @IsNotEmpty({ message: 'Please Enter Email' })
  @IsEmail(undefined, { message: 'Enter a Valid Email Address' })
  email: string;

  Age: string;
  NID: string;
  LicenseNo: string;
}

export class EmergencyContact {
  @IsString({ message: 'Invaild Input Data Type' })
  @IsNotEmpty({ message: 'Please Enter Phone No' })
  @Matches(/(^(\+8801|8801|01))[1|3-9]{1}(\d){8}$/, {
    message: 'Invaild Phone no [Use BD Convention]',
  })
  EContact: string;
}

export class SentMailOwnerDto {
  @IsEmail({}, { message: 'Enter a valid email' })
  email: string;
}

export class OtpPasswordDto {
  otp: string;
  newPassword: string;
}

export class PasswordChangeOwnerDto {
  oldPassword: string;
  newPassword: string;
}
