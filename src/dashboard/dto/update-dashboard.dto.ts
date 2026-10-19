import { PartialType } from '@nestjs/swagger';
import { CreateDashboardDto } from './create-dashboard.dto.js';

export class UpdateDashbordDto extends PartialType(CreateDashboardDto) {}
