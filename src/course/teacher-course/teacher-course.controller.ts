import { CourseService } from './../course.service';
import { Controller, Post, Body, Req, UseGuards, Get, Param, Patch } from '@nestjs/common';
import { CreateCourseDto } from '../dto/create-course.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.TEACHER)
@Controller('teacher/courses')
export class TeacherCourseController {
    constructor(private readonly courseService: CourseService) {}

    @Post()
    createCourse(@Body() dto: CreateCourseDto, @Req() req) {
        console.log('REQ.USER CREATE:', req.user);
        return this.courseService.createCourse(dto, req.user.userId);
    }

    @Get()
    getMyCourses(@Req() req) {
        return this.courseService.findMyCourses(req.user.userId);
    }

    @Patch(':id/publish')
    publishCourse(@Param('id') id: string, @Req() req) {
        return this.courseService.publishCourse(id, req.user.userId) ;
    }

    @Patch('id/unpublish')
    unpublishCourse(@Param('id') id: string, @Req() req) {
        return this.courseService.unpublishCourse(id, req.user.userId);
    }
}
