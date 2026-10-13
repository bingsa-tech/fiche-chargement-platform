import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DashboardStatsService } from './dashboard-stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Dashboard Stats')
@ApiBearerAuth()
@Controller('dashboard-stats')
@UseGuards(JwtAuthGuard)
export class DashboardStatsController {
  constructor(
    private readonly statsService: DashboardStatsService,
  ) {}

  @Get()
  async getMyStats(@Req() req) {
    return this.statsService.getStatsForUser(req.user);
  }
}