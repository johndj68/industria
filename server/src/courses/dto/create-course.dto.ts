import { IsBoolean, IsInt, IsOptional, IsString, Matches, Min, MinLength } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @MinLength(3)
  titulo: string;

  @IsString()
  @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message: 'slug deve conter apenas letras minúsculas, números e hífens',
  })
  slug: string;

  @IsString()
  @MinLength(10)
  descricao: string;

  @IsInt()
  @Min(0)
  precoCentavos: number;

  @IsOptional()
  @IsString()
  capaUrl?: string;

  @IsOptional()
  @IsBoolean()
  publicado?: boolean;
}
