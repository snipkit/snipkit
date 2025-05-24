import { Controller, Get, UseGuards } from '@nestjs/common';
import { SnipkitGuard, WithSnipkitRules, fixedWindow } from '@snipkit/nest';
import { RateLimitService } from './rate-limit.service.js';

@Controller('rate-limit')
@UseGuards(SnipkitGuard)
@WithSnipkitRules([
  fixedWindow({
    mode: 'LIVE',
    window: '30s',
    max: 1,
  }),
])
export class RateLimitController {
  constructor(private readonly rateLimitService: RateLimitService) {}

  @Get()
  getRateLimited() {
    return this.rateLimitService.message();
  }
}
