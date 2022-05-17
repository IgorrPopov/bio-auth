import { Module } from '@nestjs/common';
import { BioAuthService } from './bio-auth.service';
import { BioAuthController } from './bio-auth.controller';
import { BioAuthRepository } from './bio-auth.repository';

@Module({
  providers: [BioAuthService, BioAuthRepository],
  controllers: [BioAuthController],
})
export class BioAuthModule {}
