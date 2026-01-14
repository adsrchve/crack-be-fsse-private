import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });
  }

  async updateProfile(userId: string, name: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { name },
    });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException("User not found");

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) throw new ForbiddenException("Password not match");

    const hashed = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
  }
}
