import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class PaymentsService {
    constructor( 
        private readonly prisma: PrismaService,
        private readonly stripeService: StripeService
    ) {}

    async create(dto: CreatePaymentDto) {
        const tenantId = 'demo-tenant'; // depois vem do auth

        const intent = await this.stripeService.createPaymentIntent({
            amount: dto.amount,
            currency: dto.currency,
            paymentMethodId: dto.paymentMethod,
            confirm: true, // atenção
        });

        const status = intent.status === 'succeeded' ? 'SUCCEEDED' : 'PENDING';

        const payment = await this.prisma.payment.create({
            data: {
                tenantId,
                provider: 'STRIPE',
                amount: dto.amount,
                currency: dto.currency,
                status: status,
                providerPaymentId: intent.id,
            },
        });

        return payment;
    }
}
