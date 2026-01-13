import { IsArray, IsBoolean, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreateQuizDto {
    @IsString()
    @IsNotEmpty()
    title: string;
}

export class CreateQuestionDto {
    @IsString()
    @IsNotEmpty()
    question: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OptionDto)
    options: OptionDto[];
}

class OptionDto {
    @IsString()
    @IsNotEmpty()
    text: string;
        
    @IsBoolean()
    isCorrect: boolean;
}

export class SubmitQuizDto {
    answers: {
        questionId: string;
        optionId: string;
    }[];
}