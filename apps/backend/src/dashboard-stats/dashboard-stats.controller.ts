import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardStatsService } from './dashboard-stats.service';
 import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Votre guard existant

@Controller('dashboard-stats')
 @UseGuards(JwtAuthGuard)
export class DashboardStatsController {
  constructor(private readonly statsService: DashboardStatsService) {}

  @Get()
  async getMyStats(@Req() req) {
    // req.user contient le payload du token JWT (id, role_id, gare_id, etc.)
    const user = req.user; 
    return await this.statsService.getStatsForUser(user);
  }
}