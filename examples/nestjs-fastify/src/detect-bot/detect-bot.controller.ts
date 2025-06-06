import { Controller, Get, UseGuards } from '@nestjs/common';
import { SnipkitGuard, WithSnipkitRules, detectBot } from '@snipkit/nest';
import { DetectBotService } from './detect-bot.service.js';

@Controller('bot')
@UseGuards(SnipkitGuard)
@WithSnipkitRules([
  detectBot({
    mode: 'LIVE',
    allow: [],
  }),
])
export class DetectBotController {
  constructor(private readonly detectBotService: DetectBotService) {}

  @Get()
  detectBot() {
    return this.detectBotService.message();
  }
}
