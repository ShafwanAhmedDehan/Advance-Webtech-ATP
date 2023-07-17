import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Length,
  MinLength,
  minLength,
} from 'class-validator';

export class DriverDto {
  @IsString({ message: 'Name cant  be empty' })
  name: string;
  @IsNotEmpty()
  phone: string;
  @IsEmail({}, { message: 'Email is not correct' })
  email: string;
  @IsString()
  gender: string;
  @MinLength(7)
  password: string;
  profile: string;
}

export class DriverUpdateDto {
  @IsString({ message: 'Name cant  be empty' })
  name: string;
  @IsNotEmpty()
  phone: string;
  @IsEmail({}, { message: 'Email is not correct' })
  email: string;
  @IsString()
  gender: string;
}

export class DriverLoginDto {
  @IsEmail({}, { message: 'Email is not correct' })
  email: string;
  @MinLength(7)
  password: string;
}

export class DriverChangePass {
  @MinLength(7)
  oldPassword: string;
  @MinLength(7)
  newPassword: string;
}
