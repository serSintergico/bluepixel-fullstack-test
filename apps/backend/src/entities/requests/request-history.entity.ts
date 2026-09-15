import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Request } from './request.entity';
import { User } from '../users/user.entity';

import { RequestStatus } from '../enums/enums';

@Entity('request_histories')
export class RequestHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  requestId: string;

  @ManyToOne(() => Request, (request) => request.histories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requestId' })
  request: Request;

  @Column()
  tenantId: string;

  @Column()
  changedById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'changedById' })
  changedBy: User;

  @Column({ type: 'enum', enum: RequestStatus })
  previousStatus: RequestStatus;

  @Column({ type: 'enum', enum: RequestStatus })
  newStatus: RequestStatus;

  @CreateDateColumn()
  timestamp: Date;
}