import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { StripeService } from 'src/stripe/stripe.service';
import { PaymentStatus } from '../../generated/prisma/enums';

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

    async findAll(query: { status?: PaymentStatus, limit?: number, offset?: number }) {
        const tenantId = 'demo-tenant';

        return this.prisma.payment.findMany({
            where: {
                tenantId,
                ...(query.status && { status: query.status })
            },
            orderBy: {createdAt: 'desc'},
            take: query.limit ?? 50,
            skip: query.offset ?? 0,
            include: { tenant: { select: { name: true } } }
        });
    }

    async findOne(id: string) {
        const tenantId = 'demo-tenant';

        return this.prisma.payment.findFirst({
            where: {
                id,
                tenantId, // só retorna se for do tenant
            },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
}
