export class RegisterStudentDto {
    email: string;
    password: string;
    name: string;
}

export class RegisterTeacherDto {
    email: string;
    password: string;
    name: string;
    institution: string;
}

export class LoginDto {
    email: string;
    password: string;
}