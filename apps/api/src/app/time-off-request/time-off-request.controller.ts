import {
	Controller,
	UseGuards,
	HttpStatus,
	Post,
	Body,
	Get,
	Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CrudController } from '../core/crud/crud.controller';
import { TimeOffRequest } from './time-off-request.entity';
import { AuthGuard } from '@nestjs/passport';
import { TimeOffRequestService } from './time-off-request.service';
import { PermissionGuard } from '../shared/guards/auth/permission.guard';
import { TimeOffCreateInput as ITimeOffCreateInput } from '@gauzy/models';
import { TimeOff as ITimeOff } from '@gauzy/models';
import { IPagination } from '../core';

@ApiTags('TimeOffRequest')
@UseGuards(AuthGuard('jwt'))
@Controller()
export class TimeOffRequestControler extends CrudController<TimeOffRequest> {
	constructor(private readonly requestService: TimeOffRequestService) {
		super(requestService);
	}

	@ApiOperation({ summary: 'Find all time off requests.' })
	@UseGuards(PermissionGuard)
	@Get()
	async findAllProposals(
		@Query('data') data: string
	): Promise<IPagination<ITimeOff>> {
		const { relations, findInput, filterDate } = JSON.parse(data);

		return this.requestService.getAllTimeOffRequests(
			relations,
			findInput,
			filterDate
		);
	}

	@ApiOperation({ summary: 'Create new time off request / holiday record' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'The new time off request / holiday record created'
	})
	@UseGuards(PermissionGuard)
	@Post()
	async createOrganizationTeam(
		@Body() entity: ITimeOffCreateInput,
		...options: any[]
	): Promise<TimeOffRequest> {
		return this.requestService.create(entity);
	}
}
