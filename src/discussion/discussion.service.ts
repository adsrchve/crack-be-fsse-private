import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateDiscussionDto } from './dto/discussion.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DiscussionService {
  constructor(private prisma: PrismaService) {}

  async create(courseId: string, dto, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId }
    });

    return this.prisma.discussion.create({
      data: { ...dto, courseId, userId },
    });
  }

  async findByCourse(courseId: string) {
    return this.prisma.discussion.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
