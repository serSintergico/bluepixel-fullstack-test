import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { RequestsModule } from './entities/requests/request.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    RequestsModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
