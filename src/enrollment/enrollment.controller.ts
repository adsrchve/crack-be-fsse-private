import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollCourseDto } from './dto/enrollment.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('enrollment')
@UseGuards(JwtAuthGuard)
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  enroll(@Body() dto: EnrollCourseDto, @Req() req) {
    console.log('DTO:', dto);
    return this.enrollmentService.enroll(
      dto.courseId,
      req.user.userId,
      req.user.role
    );
  }

  @Get('me')
  myCourses(@Req() req) {
    return this.enrollmentService.myCourses(req.user.userId);
  }
}
