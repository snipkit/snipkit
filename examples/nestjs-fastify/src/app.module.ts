import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SnipkitModule, shield } from '@snipkit/nest';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { RateLimitModule } from './rate-limit/rate-limit.module.js';
import { DetectBotModule } from './detect-bot/detect-bot.module.js';
import { SensitiveInfoModule } from './sensitive-info/sensitive-info.module.js';
import { ValidateEmailModule } from './validate-email/validate-email.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    SnipkitModule.forRoot({
      isGlobal: true,
      key: process.env.SNIPKIT_KEY,
      rules: [shield({ mode: 'LIVE' })],
    }),
    RateLimitModule,
    DetectBotModule,
    SensitiveInfoModule,
    ValidateEmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // You can enable SnipkitGuard globally on every route using the `APP_GUARD`
    // token; however, this is NOT recommended. If you need to inject the
    // SnipkitNest client, you want to make sure you aren't also running
    // SnipkitGuard on the handlers calling `protect()` to avoid making multiple
    // requests to Snipkit and you can't opt-out of this global Guard.
    // {
    //   provide: APP_GUARD,
    //   useClass: SnipkitGuard
    // }
  ],
})
export class AppModule {}
