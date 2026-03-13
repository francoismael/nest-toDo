import { Body, Controller, Get, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { RegisterUsecase } from '../application/usecases/register.usecase';
import { LoginUsecase } from '../application/usecases/login.usecase';
import { GetProfileUsecase } from '../application/usecases/get-profile.usecase';
import { UpdateProfileUsecase } from '../application/usecases/update-profile.usecase';
import { ChangePasswordUsecase } from '../application/usecases/change-password.usecase';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TokenBlacklistService } from '../application/services/token-blacklist.service';

interface RequestWithUser extends Request {
  user: { userId: string };
  headers: { authorization?: string };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUsecase: RegisterUsecase,
    private readonly loginUsecase: LoginUsecase,
    private readonly getProfileUsecase: GetProfileUsecase,
    private readonly updateProfileUsecase: UpdateProfileUsecase,
    private readonly changePasswordUsecase: ChangePasswordUsecase,
    private readonly tokenBlacklist: TokenBlacklistService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.registerUsecase.execute(dto.username, dto.email, dto.password);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.loginUsecase.execute(dto.username, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: RequestWithUser) {
    return this.getProfileUsecase.execute(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() dto: { username?: string; email?: string },
  ) {
    return this.updateProfileUsecase.execute(req.user.userId, dto.username, dto.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: RequestWithUser) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) this.tokenBlacklist.add(token);
    return { message: 'Déconnecté avec succès' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/password')
  async changePassword(
    @Request() req: RequestWithUser,
    @Body() dto: { currentPassword: string; newPassword: string },
  ) {
    await this.changePasswordUsecase.execute(req.user.userId, dto.currentPassword, dto.newPassword);
    return { message: 'Mot de passe modifié avec succès' };
  }
}
