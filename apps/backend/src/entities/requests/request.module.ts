import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Request } from './request.entity';
import { RequestHistory } from './request-history.entity';
import { RequestsService } from './services/request.service';
import { RequestsController } from './controller/request.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request, RequestHistory]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {}