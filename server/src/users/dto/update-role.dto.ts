import { IsIn } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateRoleDto {
  @IsIn([Role.ALUNO, Role.ADMIN])
  role: Role;
}
