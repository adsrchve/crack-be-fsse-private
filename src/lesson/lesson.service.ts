import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LessonService {
  constructor (private prisma: PrismaService) {}

  async create(courseId: string, dto, userId: string, role: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course || course.teacherId !== userId) 
      throw new ForbiddenException("You are not the owner of this course");

    return this.prisma.lesson.create({
      data: { ...dto, courseId },
    });
  }

  async findByCourse(courseId: string) {
    return this.prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    });
  }
}
