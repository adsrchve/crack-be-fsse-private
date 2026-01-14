import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdateProfileDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class changePasswordDto {
    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @IsString()
    @MinLength(8)
    newPassword: string;
}
