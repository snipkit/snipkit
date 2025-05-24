import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SnipkitGuard, WithSnipkitRules, sensitiveInfo } from '@snipkit/nest';
import { SensitiveInfoService } from './sensitive-info.service.js';

@Controller('sensitive-info')
@UseGuards(SnipkitGuard)
@WithSnipkitRules([
  sensitiveInfo({
    mode: 'LIVE',
    deny: ['PHONE_NUMBER'],
  }),
])
export class SensitiveInfoController {
  constructor(private readonly sensitiveInfoService: SensitiveInfoService) {}

  @Post()
  sensitiveInfo(@Body() body: string) {
    return this.sensitiveInfoService.message(body);
  }
}
