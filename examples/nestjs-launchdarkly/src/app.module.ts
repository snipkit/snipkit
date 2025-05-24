import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SnipkitGuard, SnipkitModule } from '@snipkit/nest';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SnipkitConfig } from './config/snipkit.js';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    SnipkitModule.forRootAsync({
      isGlobal: true,
      useClass: SnipkitConfig,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // You can enable SnipkitGuard globally on every route using the `APP_GUARD`
    // token; however, this is NOT recommended. If you need to inject the
    // SnipkitNest client, you want to make sure you aren't also running
    // SnipkitGuard on the handlers calling `protect()` to avoid making multiple
    // requests to Snipkit and you can't opt-out of this global Guard.
    {
      provide: APP_GUARD,
      useClass: SnipkitGuard,
    },
  ],
})
export class AppModule {}
