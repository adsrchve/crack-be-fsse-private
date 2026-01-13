import { Controller, Get, Patch, Param, Query, UseGuards, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role, UserStatus } from '@prisma/client';

@Controller('admin')
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('teachers/:id/approve')
  async approveTeacher(@Param('id') id: string) {
    const teacher = await this.prisma.user.findFirst({
      where: {
        id,
        role: Role.TEACHER,
        status: UserStatus.PENDING,
      },
    });

    if (!teacher) throw new NotFoundException('Teacher not found!');
    if (teacher.role !== Role.TEACHER) throw new BadRequestException('User is not a teacher!');
    if (teacher.status !== UserStatus.PENDING) throw new BadRequestException('Teacher request has approved!');

    const updated = await this.prisma.user.update({
      where: { id },
      data: { status: UserStatus.ACTIVE },
    });

    return {
      message: 'Teacher request approved',
      teacher: {
        email: updated.email,
        status: updated.status,
      },
    };
  }

  @Get('teachers/approve')
  async approveTeacherViaLink(@Query('token') token: string) {
    if (!token) throw new BadRequestException('Approval token required');

    const teacher = await this.prisma.user.findFirst({
      where: {
        approvalToken: token.trim(),
        role: Role.TEACHER,
        status: UserStatus.PENDING,
      },
    });

    if (!teacher) throw new NotFoundException('Invalid or expired approval token');

    await this.prisma.user.update({
      where: { id: teacher.id },
      data: { status: UserStatus.ACTIVE, approvalToken: null },
    });

    return {
      message: 'Teacher approved successfully. You may close this page.',
    }
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('users')
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

}
