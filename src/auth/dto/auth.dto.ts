import { IsEmail, IsString, Min, MinLength } from "class-validator";

export class RegisterStudentDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    name: string;
}

export class RegisterTeacherDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    name: string;

    @IsString()
    institution: string;
}

export class LoginDto {
    @IsEmail()
    email: string;
    
    @IsString()
    password: string;
}