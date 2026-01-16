import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourseStatus } from '@prisma/client';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  // ===================
  // TEACHER
  // ===================

  createCourse(dto: CreateCourseDto, teacherId: string) {
    return this.prisma.course.create({
      data: { ...dto, teacherId, status: CourseStatus.DRAFT },
    });
  }

  async publishCourse(courseId: string, teacherId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) throw new ForbiddenException('Course not found');
    if (course.teacherId !== teacherId) throw new ForbiddenException('Not your course');

    return this.prisma.course.update({
      where: { id: courseId },
      data: { status: CourseStatus.PUBLISHED },
    });
  }

  async unpublishCourse(courseId: string, teacherId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) throw new ForbiddenException('Course not found');
    if (course.teacherId !== teacherId) throw new ForbiddenException('Not your course');

    return this.prisma.course.update({
      where: { id: courseId },
      data: { status: CourseStatus.DRAFT },
    });
  }

  findMyCourses(teacherId: string) {
    return this.prisma.course.findMany({
      where: { teacherId },
      orderBy: { createdAt: 'desc' },
    });
  }


  // ===================
  // STUDENT
  // ===================

  findAllCourses() {
    return this.prisma.course.findMany({
      where: { status: CourseStatus.PUBLISHED },
      include: { teacher: true },
    });
  }

  findOneCourse(id: string) {
    return this.prisma.course.findFirst({
      where: { id, status: CourseStatus.PUBLISHED },
      include: { teacher: true },
    });
  }

}
