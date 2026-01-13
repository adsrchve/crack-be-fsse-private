import { Controller, Get, Post, Body, Patch, Param, Req, Delete, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuestionDto, CreateQuizDto, SubmitQuizDto } from './dto/quiz.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('courses/:courseId/quiz')
@UseGuards(JwtAuthGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateQuizDto, @Param('courseId') courseId: string) {
    return this.quizService.create(courseId, dto.title, req.user.userId);
  }

  @Post(':quizId/questions')
  addQuestion(@Req() req, @Body() dto: CreateQuestionDto, @Param('quizId') quizId: string) {
    return this.quizService.addQuestion(quizId, dto, req.user.userId);
  }

  @Post(':quizId/submit')
  submit(@Req() req, @Body() dto: SubmitQuizDto, @Param('quizId') quizId: string) {
    return this.quizService.submit(quizId, dto, req.user.userId);
  }
}
