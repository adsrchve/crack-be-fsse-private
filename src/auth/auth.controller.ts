import { AuthService } from './auth.service';
import { Controller } from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { RegisterStudentDto, LoginDto, RegisterTeacherDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // User registration
    @Post('register/student')
    registerStudent(@Body() dto: RegisterStudentDto) {
        return this.authService.registerStudent(dto);
    }

    @Post('register/teacher')
    registerTeacher(@Body() dto: RegisterTeacherDto) {
        return this.authService.registerTeacher(dto);
    }

    // User login
    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}