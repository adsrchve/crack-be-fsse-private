import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateAssignmentDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    description: string;

    @IsDateString()
    dueDate: string;
}
