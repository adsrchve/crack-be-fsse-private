import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCourseDto, userId: string, role: string) {
    if (role !== 'ADMIN' && role !== 'TEACHER')
      throw new ForbiddenException('Only teacher can add course');

    return this.prisma.course.create({
      data: { ...dto, teacherId: userId },
    });
  }

  findAll() {
    return this.prisma.course.findMany({
      include: { teacher: true },
    });
  }

  findMyCourses(userId: string) {
    return this.prisma.course.findMany({
      where: { teacherId: userId },
    });
  }
}
