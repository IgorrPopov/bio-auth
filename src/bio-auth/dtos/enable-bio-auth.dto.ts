import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class EnableBioAuthDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  readonly userId: string; // Use something like JWT to get userId

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  readonly deviceId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  readonly publicKey: string;
}
