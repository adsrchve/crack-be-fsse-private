import { AuthService } from './auth.service';
import { Controller, Get, UseGuards, Req, NotFoundException, Query, Res } from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { RegisterStudentDto, LoginDto, RegisterTeacherDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import type { Response } from 'express';

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

    @Get('approve')
    async approveTeacher(@Query('token') token: string) {
        return this.authService.approveTeacher(token);
    }

    // ======= USER LOGIN =======
    @Post('login')
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.login(dto);

        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false, 
            path: '/',
        });
        
        return {
            message: 'Login success', 
            user: result.user,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@Req() req) {
        return req.user;
    }

}