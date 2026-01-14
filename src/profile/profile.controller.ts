import { Controller, Get, Body, Patch, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { changePasswordDto, UpdateProfileDto } from './dto/profile.dto';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@Req() req) {
    return this.profileService.getProfile(req.user.userId);
  }

  @Patch()
  updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(req.user.userId, dto.name)
  }

  @Patch('password')
  changePassword(@Req() req, @Body() dto: changePasswordDto) {
    return this.profileService.changePassword(
      req.user.userId,
      dto.oldPassword,
      dto.newPassword,
    );
  }
}
