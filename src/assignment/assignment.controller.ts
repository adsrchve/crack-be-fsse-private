import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/assignment.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('courses/:courseId/assignment')
@UseGuards(JwtAuthGuard)
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateAssignmentDto, @Param('courseId') courseId: string) {
    return this.assignmentService.create(courseId, dto, req.user.userId);
  }

  @Get()
  find(@Param('courseId') courseId: string) {
    return this.assignmentService.findByCourse(courseId);
  }
}
