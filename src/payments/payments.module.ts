import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService],
  imports: [StripeModule],
})
export class PaymentsModule {}
