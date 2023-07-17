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

export class PassengerDto {
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
}

export class PassengerUpdateDto {
  @IsString({ message: 'Name cant  be empty' })
  name: string;
  @IsNotEmpty()
  phone: string;
  @IsEmail({}, { message: 'Email is not correct' })
  email: string;
  @IsString()
  gender: string;
  driver: number;
}
