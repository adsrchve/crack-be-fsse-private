import { Body, Controller, Get, Patch, Param, Query, UseGuards, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role, UserStatus } from '@prisma/client';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  
  // ====== USERS ======
  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  // ====== TEACHER APPROVAL ======
  @Patch('teachers/:id/approve')
  approveTeacher(@Param('id') id: string) {
    return this.adminService.approveTeacherByAdmin(id);
  }

  @Get('teachers/approve')
  approveTeacherViaLink(@Query('token') token: string) {
    return this.adminService.approveTeacherByToken(token);
  }

  // ====== TEACHER REJECTION ======
  @Patch('teachers/:id/reject')
  rejectTeacher(@Param('id') id: string) {
    return this.adminService.rejectTeacherByAdmin(id);
  }

}
