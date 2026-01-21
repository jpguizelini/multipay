import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
    constructor( private readonly prisma: PrismaService) {}

    async create(createPaymentDto: CreatePaymentDto) {
        const tenantId = 'demo-tenant'; // depois vem do auth

        const payment = await this.prisma.payment.create({
            data: {
                tenantId,
                provider: 'STRIPE',
                amount: createPaymentDto.amount,
                currency: createPaymentDto.currency,
                status: 'PENDING',
                providerPaymentId: crypto.randomUUID(), // depois vem da Stripe
            },
        });

        return payment;
    }
}
