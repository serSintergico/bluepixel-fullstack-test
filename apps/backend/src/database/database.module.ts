import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../entities/tenants/tenant.entity';
import { User } from '../entities/users/user.entity';
import { Request } from '../entities/requests/request.entity';
import { RequestHistory } from '../entities/requests/request-history.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      host: process.env.POSTGRES_HOST || process.env.DB_HOST || 'postgres',
      port: parseInt(process.env.POSTGRES_PORT || process.env.DB_PORT || '5432', 10),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'bluepixel_db',
      entities: [Tenant, User, Request, RequestHistory],
      synchronize: true,
      retryAttempts: 10,
      retryDelay: 3000,
    }),
  ],
})
export class DatabaseModule {}