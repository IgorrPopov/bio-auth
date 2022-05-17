import { Module } from '@nestjs/common';
import { BioAuthModule } from './bio-auth/bio-auth.module';

@Module({
  imports: [BioAuthModule],
})
export class AppModule {}
