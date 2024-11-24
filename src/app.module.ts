import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { DatabaseService } from "./database/database.service";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth/auth.guard";
import { RolesGuard } from "./auth/roles.guard";

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppService,
    DatabaseService],
})
export class AppModule {}
