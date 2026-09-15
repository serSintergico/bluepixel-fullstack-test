import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { RequestsService } from '../services/request.service';
import { JwtAuthGuard, CurrentUser } from '../../../auth/jwt-auth.guard';
import { CreateRequestDto } from '../dto/create-request.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';

@Controller('requests')
@UseGuards(JwtAuthGuard)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.requestsService.findAll(user.tenantId);
  }

  @Get('dashboard/stats')
  getStats(@CurrentUser() user: any) {
    return this.requestsService.getDashboardStats(user.tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.requestsService.findOne(id, user.tenantId);
  }

  @Post()
  create(@Body() dto: CreateRequestDto, @CurrentUser() user: any) {
    return this.requestsService.create(dto, user);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.requestsService.updateStatus(id, dto, user);
  }
}