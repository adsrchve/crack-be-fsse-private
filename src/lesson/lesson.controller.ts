import { Controller, Get, Post, Body, Req, Param, Delete, UseGuards } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('courses/:courseId/lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateLessonDto, @Param('courseId') courseId: string) {
    return this.lessonService.create(courseId, dto, req.user.userId, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  find(@Param('courseId') courseId: string) {
    return this.lessonService.findByCourse(courseId);
  }
}
