import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateQuestionDto, SubmitQuizDto } from './dto/quiz.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  async create(courseId: string, title: string, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course || course.teacherId !== userId)
      throw new ForbiddenException();

    return this.prisma.quiz.create({ data: { title, courseId } });
  }

  async addQuestion(quizId: string, dto: CreateQuestionDto, userId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { course: true },
    });

    if (quiz?.course.teacherId !== userId)
      throw new ForbiddenException();

    return this.prisma.quizQuestion.create({
      data: {
        question: dto.question,
        quizId,
        options: { create: dto.options },
      },
      include: { options: true },
    });
  }

  async submit(quizId: string, dto: SubmitQuizDto, userId: string) {
    let score = 0;

    for (const ans of dto.answers) {
      const opt = await this.prisma.quizOption.findUnique({
        where: { id: ans.optionId },
      })

      if (opt?.isCorrect) score++;
    }

    return this.prisma.quizSubmission.create({
      data: { quizId, userId, score },
    });
  }
}
