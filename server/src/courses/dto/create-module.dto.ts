import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @MinLength(2)
  titulo: string;

  @IsInt()
  @Min(0)
  ordem: number;
}
