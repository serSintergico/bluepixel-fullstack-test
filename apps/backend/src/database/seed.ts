import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Tenant } from '../entities/tenants/tenant.entity';
import { User } from '../entities/users/user.entity';
import { Role, RequestStatus } from '../entities/enums/enums';
import { Request } from '../entities/requests/request.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🌱 Ejecutando Seed de base de datos...');

  // Asegurar que las tablas existan antes de truncar o poblar
  await dataSource.synchronize();

  // Limpieza segura en cascada para evitar errores de Foreign Keys
  try {
    await dataSource.query(
      `TRUNCATE TABLE "request_histories", "requests", "users", "tenants" RESTART IDENTITY CASCADE;`
    );
  } catch (error) {
    console.warn('Aviso al limpiar tablas:', (error as Error)?.message || error);
  }

  const tenantRepo = dataSource.getRepository(Tenant);
  const userRepo = dataSource.getRepository(User);
  const requestRepo = dataSource.getRepository(Request);

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Crear Tenants (Organizaciones)
  const tenant1 = await tenantRepo.save(tenantRepo.create({ name: 'Empresa Alfa' }));
  const tenant2 = await tenantRepo.save(tenantRepo.create({ name: 'Empresa Beta' }));

  // 2. Crear Usuarios para Tenant Alfa
  const adminAlfa = await userRepo.save(
    userRepo.create({
      email: 'admin@alfa.com',
      password: hashedPassword,
      role: Role.ADMIN,
      tenantId: tenant1.id,
    }),
  );

  const memberAlfa = await userRepo.save(
    userRepo.create({
      email: 'member@alfa.com',
      password: hashedPassword,
      role: Role.MEMBER,
      tenantId: tenant1.id,
    }),
  );

  // 3. Crear Usuario para Tenant Beta (Prueba de aislamiento multi-tenant)
  await userRepo.save(
    userRepo.create({
      email: 'admin@beta.com',
      password: hashedPassword,
      role: Role.ADMIN,
      tenantId: tenant2.id,
    }),
  );

  // 4. Crear Solicitud Inicial de prueba
  await requestRepo.save(
    requestRepo.create({
      title: 'Equipo de Cómputo',
      description: 'Solicitud para 3 monitores Dell',
      status: RequestStatus.SUBMITTED,
      tenantId: tenant1.id,
      createdById: memberAlfa.id,
    }),
  );

  console.log('✅ Seed completado con éxito:');
  console.log(' - Admin Alfa: admin@alfa.com (password123)');
  console.log(' - Member Alfa: member@alfa.com (password123)');
  console.log(' - Admin Beta: admin@beta.com (password123)');

  await app.close();
  process.exit(0);
}

bootstrap();