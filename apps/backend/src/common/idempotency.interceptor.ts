import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

// Mapa en memoria para desarrollo (En producción usar Redis)
const idempotencyStore = new Map<string, { status: number; body: any }>();

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Solo aplicar a POST, PATCH o PUT
    if (!['POST', 'PATCH', 'PUT'].includes(method)) {
      return next.handle();
    }

    const idempotencyKey = request.headers['idempotency-key'];

    // Si el cliente no envía la clave en operaciones mutables, exigirla
    if (!idempotencyKey) {
      return next.handle(); // O lanzar BadRequestException si quieres hacerla obligatoria
    }

    const key = `${request.user?.tenantId}:${idempotencyKey}`;

    // Si la respuesta ya está en caché, devolver la misma respuesta guardada
    if (idempotencyStore.has(key)) {
      const cached = idempotencyStore.get(key);
      const response = context.switchToHttp().getResponse();
      response.status(cached?.status);
      return of(cached?.body);
    }

    // Si es nueva, procesar la petición y guardar la respuesta en caché
    return next.handle().pipe(
      tap((body) => {
        const response = context.switchToHttp().getResponse();
        idempotencyStore.set(key, { status: response.statusCode, body });
      }),
    );
  }
}