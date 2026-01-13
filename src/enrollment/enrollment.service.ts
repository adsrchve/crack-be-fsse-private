import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { EnrollCourseDto } from './dto/enrollment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async enroll(courseId: string, userId: string, role: string) {
    if (role !== 'STUDENT') 
      throw new ForbiddenException('Only students can enroll the course');

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) throw new BadRequestException("Course not found");

    try {
      return await this.prisma.enrollment.create({
        data : { courseId, userId },
      });
    }
    catch (err) {
      throw new BadRequestException("You already enrolled this course");
    }
  }

  myCourses(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: { course: true },
    });
  }
}
