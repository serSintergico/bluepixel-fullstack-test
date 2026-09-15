import { IsEnum, IsNotEmpty } from 'class-validator';
import { RequestStatus } from '../../enums/enums';

export class UpdateStatusDto {
  @IsEnum(RequestStatus, { message: 'El estado provisto no es válido' })
  @IsNotEmpty()
  status: RequestStatus;
}