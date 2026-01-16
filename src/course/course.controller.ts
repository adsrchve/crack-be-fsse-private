import { Controller, Get, Post, Param, Body, Req, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from '@prisma/client';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // ===================
  // STUDENT
  // ===================

  @Get()
  findAllCourses() {
    return this.courseService.findAllCourses();
  }

  @Get(':id')
  findOneCourse(@Param('id') id: string) {
    return this.courseService.findOneCourse(id);
  }

}
