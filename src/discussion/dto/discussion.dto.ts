import { IsString } from "class-validator";

export class CreateDiscussionDto {
    @IsString()
    content: string;
}
