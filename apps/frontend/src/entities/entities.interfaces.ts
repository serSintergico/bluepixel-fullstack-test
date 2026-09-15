
// Tipos para el sistema
export enum RequestStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum Role {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export interface User {
  id: string;
  email: string;
  role: Role;
  tenantId: string;
}

export interface RequestHistory {
  id: string;
  previousStatus: RequestStatus;
  newStatus: RequestStatus;
  timestamp: string;
  changedBy: { email: string };
}

export interface RequestItem {
  id: string;
  title: string;
  description: string;
  status: RequestStatus;
  createdAt: string;
  createdBy: { email: string };
  histories?: RequestHistory[];
}