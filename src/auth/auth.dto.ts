import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

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
