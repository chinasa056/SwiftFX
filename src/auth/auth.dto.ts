import { GenderType } from '@prisma/client';
import { IsNotEmpty, IsString, IsEmail, IsDateString, IsOptional } from 'class-validator';

export class RegisterUserInput {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class RegisterUserResponse {
  @IsString()
  message: string;
}

export class VerifyEmailCodeInput {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  code: string;
}
export class CompleteProfileInput {
  @IsString()
  @IsNotEmpty()
  registrationToken: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  gender?: GenderType;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}