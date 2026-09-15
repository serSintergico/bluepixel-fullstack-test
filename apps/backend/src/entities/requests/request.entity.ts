import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { User } from '../users/user.entity';
import { RequestHistory } from '../requests/request-history.entity';

import { RequestStatus } from '../enums/enums';

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.DRAFT })
  status: RequestStatus;

  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.requests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column()
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @OneToMany(() => RequestHistory, (history) => history.request)
  histories: RequestHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}