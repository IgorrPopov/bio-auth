import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class BioLoginDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  readonly deviceId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(10000)
  readonly signature: string;
}
