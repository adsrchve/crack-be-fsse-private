import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, UserStatus } from '@prisma/client';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) {}

    // ====== USERS ======
    getAllUsers() {
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
        });
    }

    // ====== APPROVE TEACHER BY ADMIN ======
    async approveTeacherByAdmin(id: string) {
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

    // ====== APPROVE TEACHER BY EMAIL ======
    async approveTeacherByToken(token: string) {
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
        };
    }


    // ====== TEACHER REJECTION ======
    async rejectTeacherByAdmin(id: string) {
        const teacher = await this.prisma.user.findFirst({
            where: {
                id,
                role: Role.TEACHER, 
                status: UserStatus.PENDING,
            },
        });

        if (!teacher) throw new NotFoundException('Teacher not found or not pending');

        await this.prisma.user.update({
            where: { id },
            data: { status: UserStatus.REJECTED },
        });

        return {
            message: 'Teacher request rejected'
        }
    }
}
