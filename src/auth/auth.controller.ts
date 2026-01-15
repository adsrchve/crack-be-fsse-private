import { AuthService } from './auth.service';
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { RegisterStudentDto, LoginDto, RegisterTeacherDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

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

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Req() req) {
        return req.user;
    }
}