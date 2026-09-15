import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { RequestsService } from '../../src/entities/requests/services/request.service';
import { Request } from '../../src/entities/requests/request.entity';
import { RequestHistory } from '../../src/entities/requests/request-history.entity';
import { RequestStatus, Role } from '../../src/entities/enums/enums';

describe('RequestsService', () => {
  let service: RequestsService;

  const mockRequestRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
 
  const mockHistoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsService,
        {
          provide: getRepositoryToken(Request),
          useValue: mockRequestRepository,
        },
        {
          provide: getRepositoryToken(RequestHistory),
          useValue: mockHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('updateStatus', () => {
    it('debe lanzar ForbiddenException si un usuario MEMBER intenta APROBAR una solicitud', async () => {
      const mockRequest = {
        id: 'req-1',
        title: 'Prueba',
        status: RequestStatus.SUBMITTED,
        tenantId: 'tenant-alfa',
      };

      mockRequestRepository.findOne.mockResolvedValue(mockRequest);

      const userMember = {
        userId: 'user-1',
        tenantId: 'tenant-alfa',
        role: Role.MEMBER,
      };

      await expect(
        service.updateStatus('req-1', { status: RequestStatus.APPROVED }, userMember),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debe permitir a un usuario ADMIN APROBAR una solicitud y registrar historial', async () => {
      const mockRequest = {
        id: 'req-1',
        title: 'Prueba',
        status: RequestStatus.SUBMITTED,
        tenantId: 'tenant-alfa',
      };

      mockRequestRepository.findOne.mockResolvedValue(mockRequest);
      mockRequestRepository.save.mockResolvedValue({
        ...mockRequest,
        status: RequestStatus.APPROVED,
      });

      const userAdmin = {
        userId: 'admin-1',
        tenantId: 'tenant-alfa',
        role: Role.ADMIN,
      };

      const result = await service.updateStatus('req-1', { status: RequestStatus.APPROVED }, userAdmin);

      expect(result.status).toBe(RequestStatus.APPROVED);
      expect(mockHistoryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          previousStatus: RequestStatus.SUBMITTED,
          newStatus: RequestStatus.APPROVED,
        }),
      );
    });

    it('debe lanzar NotFoundException si se intenta acceder a una solicitud de otro Tenant', async () => {
      mockRequestRepository.findOne.mockResolvedValue(null);

      const userAdmin = {
        userId: 'admin-1',
        tenantId: 'tenant-beta', // Intenta acceder a Tenant distinto
        role: Role.ADMIN,
      };

      await expect(
        service.updateStatus('req-otro-tenant', { status: RequestStatus.APPROVED }, userAdmin),
      ).rejects.toThrow(NotFoundException);
    });
  });
});