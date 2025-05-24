import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service.js';
import { SnipkitGuard } from '@snipkit/nest';

@Controller()
@UseGuards(SnipkitGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  index() {
    return this.appService.message();
  }
}
