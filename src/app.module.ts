import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { LessonModule } from './lesson/lesson.module';

@Module({
  imports: [AuthModule, PrismaModule, AdminModule, CourseModule, EnrollmentModule, LessonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
