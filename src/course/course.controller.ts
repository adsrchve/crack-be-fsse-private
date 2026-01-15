import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateCourseDto, @Req() req) {
    console.log('USER:', req.user);
    return this.courseService.create(dto, req.user.userId, req.user.role);
  }

  @Get()
  findAllCourses() {
    return this.courseService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  muyCourses(@Req() req) {
    return this.courseService.findMyCourses(req.user.userId);
  }
}
