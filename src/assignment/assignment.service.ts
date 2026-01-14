import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/assignment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AssignmentService {
  constructor(private prisma: PrismaService) {}

  async create(courseId: string, dto, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course || course.teacherId !== userId)
      throw new ForbiddenException("You are not course owner");
  
    return this.prisma.assignment.create({
      data: { ...dto, dueDate: dto.dueDate, courseId },
    });
  }

  findByCourse(courseId: string) {
    return this.prisma.assignment.findMany({
      where: { courseId },
    });
  }
}
