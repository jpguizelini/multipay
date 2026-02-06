import { Controller, Get, Post, Body, Query, Param, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';
import { PaymentStatus } from '../../generated/prisma/enums';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}
    
    @Post()
    create(@Body() createPaymentDto: CreatePaymentDto) {
        return this.paymentsService.create(createPaymentDto)
    }

    @Get()
    findAll(@Query('status') status?: string) {
        let paymentStatus: PaymentStatus | undefined;

        if (status) {
            // Verifica se o status é um valor válido do enum
            if (Object.values(PaymentStatus).includes(status as PaymentStatus)) {
                paymentStatus = status as PaymentStatus;
            } else {
                // Se não for válido, pode retornar erro ou ignorar
                // Por enquanto, vamos ignorar (retorna undefined)
                paymentStatus = undefined;
            }
        }
        
        return this.paymentsService.findAll({ status: paymentStatus });
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const payment = await this.paymentsService.findOne(id);
        if(!payment) {
            throw new NotFoundException(`Pagamento com id${id} não encontrado.`);
        }
        return payment;
    }
}
