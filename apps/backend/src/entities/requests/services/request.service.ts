import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from '../request.entity';
import { RequestHistory } from '../request-history.entity';
import { RequestStatus, Role } from '../../enums/enums';
import { CreateRequestDto } from '../dto/create-request.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepo: Repository<Request>,
    @InjectRepository(RequestHistory)
    private readonly historyRepo: Repository<RequestHistory>,
  ) {}

  // Listar solicitudes pertenecientes únicamente al Tenant del usuario
  async findAll(tenantId: string) {
    return this.requestRepo.find({
      where: { tenantId },
      relations: {
        createdBy: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  // Obtener detalle de solicitud con historial
  async findOne(id: string, tenantId: string) {
    const request = await this.requestRepo.findOne({
      where: { id, tenantId },
      relations: {
        createdBy: true,
        histories: {
          changedBy: true,
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Solicitud no encontrada o no pertenece a tu organización');
    }

    return request;
  }

  // Crear una nueva solicitud
  async create(dto: CreateRequestDto, user: { userId: string; tenantId: string }) {
    const request = this.requestRepo.create({
      title: dto.title,
      description: dto.description,
      tenantId: user.tenantId,
      createdById: user.userId,
      status: RequestStatus.DRAFT,
    });

    return this.requestRepo.save(request);
  }

  // Actualizar estado y guardar auditoría en historial
  async updateStatus(
    id: string,
    dto: UpdateStatusDto,
    user: { userId: string; tenantId: string; role: string },
  ) {
    const request = await this.findOne(id, user.tenantId);

    // Regla de Negocio: Solamente ADMINs pueden Aprobar o Rechazar
    if (
      (dto.status === RequestStatus.APPROVED || dto.status === RequestStatus.REJECTED) &&
      user.role !== Role.ADMIN
    ) {
      throw new ForbiddenException('Solo un usuario con rol ADMIN puede aprobar o rechazar solicitudes');
    }

    if (request.status === dto.status) {
      throw new BadRequestException(`La solicitud ya se encuentra en estado ${dto.status}`);
    }

    const previousStatus = request.status;
    request.status = dto.status;

    const updatedRequest = await this.requestRepo.save(request);

    // Registro de Auditoría en RequestHistory
    const history = this.historyRepo.create({
      requestId: request.id,
      tenantId: user.tenantId,
      changedById: user.userId,
      previousStatus,
      newStatus: dto.status,
    });
    await this.historyRepo.save(history);

    return updatedRequest;
  }

  // Métricas para el Dashboard por Estado
  async getDashboardStats(tenantId: string) {
    const requests = await this.requestRepo.find({ where: { tenantId } });

    return {
      total: requests.length,
      draft: requests.filter((r) => r.status === RequestStatus.DRAFT).length,
      submitted: requests.filter((r) => r.status === RequestStatus.SUBMITTED).length,
      approved: requests.filter((r) => r.status === RequestStatus.APPROVED).length,
      rejected: requests.filter((r) => r.status === RequestStatus.REJECTED).length,
    };
  }
}