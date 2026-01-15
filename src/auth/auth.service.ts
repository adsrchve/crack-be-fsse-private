import { PrismaService } from 'src/prisma/prisma.service';
import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterStudentDto, LoginDto, RegisterTeacherDto } from './dto/auth.dto';
import { Role, UserStatus } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

// STUDENT REGISTRATION
    async registerStudent(dto: RegisterStudentDto) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existing) throw new ConflictException('Email already registered');

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                name: dto.name,
                role: Role.STUDENT,
                status: UserStatus.ACTIVE,
            },
        });

        return {
            message: 'Student registered successfully',
            status: user.status,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }


// TEACHER REGISTRATION
    async registerTeacher(dto: RegisterTeacherDto) {
        console.log('🔥 REGISTER TEACHER HIT');

        const token = randomUUID();
        const approvalLink = `${process.env.FRONTEND_URL}/approve?token=${token}`;

        console.log('Approval Link:', approvalLink);

        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existing) throw new ConflictException('Email already registered');

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                name: dto.name,
                role: Role.TEACHER,
                status: UserStatus.PENDING,
                approvalToken: token,
            },
        });

        return {
            message: 'Teacher registration submitted',
            approvalLink,
        };
    }

    async approveTeacher(token: string) {
        const user = await this.prisma.user.findFirst({
            where: { approvalToken: token },
        });

        if (!user) throw new NotFoundException('Invalid approval token');

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                status: UserStatus.ACTIVE,
                approvalToken: null,
            },
        });
        
        return { message: 'Account activated' };
    }


// LOGIN
    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) throw new UnauthorizedException('Invalid credentials');
        if (user.status !== UserStatus.ACTIVE) {
            throw new ForbiddenException('Account not approved yet');
        }
        
        const isMatch = await bcrypt.compare(dto.password, user.password);

        if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        const accessToken = await this.jwtService.signAsync(payload);

        return {
            message: 'Login success',
            accessToken: accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    };
}