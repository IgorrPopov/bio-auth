import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class DisableBioAuthDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  readonly userId: string; // Use something like JWT to get userId
}
