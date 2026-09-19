import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @MinLength(2)
  titulo: string;

  @IsInt()
  @Min(0)
  ordem: number;

  @IsOptional()
  @IsString()
  cfVideoId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  duracaoSeg?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  xpRecompensa?: number;
}
