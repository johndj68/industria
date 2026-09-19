import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  listar(@Query('busca') busca?: string) {
    return this.usersService.listAll(busca);
  }

  @Get(':id')
  detalhe(@Param('id') id: string) {
    return this.usersService.getDetalhe(id);
  }

  @Patch(':id/role')
  atualizarRole(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() solicitante: { userId: string },
  ) {
    return this.usersService.updateRole(id, dto.role, solicitante.userId);
  }
}
