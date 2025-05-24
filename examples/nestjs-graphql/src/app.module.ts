import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { SnipkitGuard, SnipkitModule, detectBot, shield } from '@snipkit/nest';

import { RecipesModule } from './recipes/recipes.module.js';

@Module({
  imports: [
    RecipesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
    SnipkitModule.forRoot({
      isGlobal: true,
      key: process.env.SNIPKIT_KEY,
      rules: [shield({ mode: 'LIVE' }), detectBot({ mode: 'LIVE', allow: [] })],
    }),
  ],
  providers: [
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
