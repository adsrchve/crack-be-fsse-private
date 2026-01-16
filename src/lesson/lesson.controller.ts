import { Controller, Get, Post, Body, Req, Param, UseGuards } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('courses/:courseId/lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateLessonDto, @Param('courseId') courseId: string) {
    return this.lessonService.create(courseId, dto, req.user.userId, req.user.role);
  }

  @Get()
  findByCourse(@Param('courseId') courseId: string) {
    return this.lessonService.findByCourse(courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':lessonId/complete')
  completedLesson(@Req() req, @Param('lessonId') lessonId: string) {
    return this.lessonService.completedLesson(req.user.userId, lessonId);
  }
}
