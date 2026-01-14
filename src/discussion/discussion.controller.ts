import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { DiscussionService } from './discussion.service';
import { CreateDiscussionDto } from './dto/discussion.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('courses/:courseId/discussion')
@UseGuards(JwtAuthGuard)
export class DiscussionController {
  constructor(private readonly discussionService: DiscussionService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateDiscussionDto, @Param('courseId') courseId: string) {
    return this.discussionService.create(courseId, dto, req.user.userId);
  }

  @Get()
  find(@Param('courseId') courseId: string) {
    return this.discussionService.findByCourse(courseId);
  }
}
