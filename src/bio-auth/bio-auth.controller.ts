import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { BioAuthService } from './bio-auth.service';
import { BioLoginDto } from './dtos/bio-login.dto';
import { UserDto } from './dtos/create-user.dto';
import { DisableBioAuthDto } from './dtos/disable-bio-auth.dto';
import { EnableBioAuthDto } from './dtos/enable-bio-auth.dto';
import { IHashToken } from './interfaces/hash-token.interface';
import { IUser } from './interfaces/user.interface';

@Controller('bio-auth')
export class BioAuthController {
  constructor(private readonly bioAuthService: BioAuthService) {}

  @Post('signup')
  signup(@Body() userDto: UserDto): IUser {
    return this.bioAuthService.signup(userDto);
  }

  @Post('login')
  login(@Body() userDto: UserDto): IUser {
    return this.bioAuthService.login(userDto);
  }

  @Post('bio-login')
  bioLogin(@Body() bioLoginDto: BioLoginDto): IUser {
    return this.bioAuthService.bioLogin(bioLoginDto);
  }

  @Patch('enable')
  enableBioAuth(@Body() enableBioAuthDto: EnableBioAuthDto): void {
    return this.bioAuthService.enableBioAuth(enableBioAuthDto);
  }

  @Patch('disable')
  disableBioAuth(@Body() disableBioAuthDto: DisableBioAuthDto): void {
    return this.bioAuthService.disableBioAuth(disableBioAuthDto);
  }

  @Get('hash-token')
  getHashToken(@Query('deviceId') deviceId: string): IHashToken {
    return this.bioAuthService.getHashToken(deviceId);
  }
}
