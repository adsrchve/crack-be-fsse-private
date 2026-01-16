import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TeacherCourseController } from './teacher-course/teacher-course.controller';

@Module({
  controllers: [CourseController, TeacherCourseController],
  providers: [CourseService],
})
export class CourseModule {}
