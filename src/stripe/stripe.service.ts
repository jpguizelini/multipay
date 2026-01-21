import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';

@Injectable()
export class StripeService {
    private readonly client: Stripe;

    constructor() {
        this.client = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
            apiVersion: '2025-12-15.clover',  
        });
    }

    getClient() {
        return this.client;
    }

    async createPaymentIntent(params: {
        amount: number;
        currency: string;
        paymentMethodId?: string; // opicional se for confirmar depois
        confirm?: boolean; 
    }): Promise<Stripe.PaymentIntent> {
        const { amount, currency, paymentMethodId, confirm } = params;

        return this.client.paymentIntents.create({
            amount,
            currency: currency.toLocaleLowerCase(),
            payment_method: paymentMethodId,
            confirm: confirm ?? false, //se confirm ñ foi passado == false
            automatic_payment_methods: paymentMethodId ? undefined : { enabled: true },
            //se foi informado == undefined ; se não foi informado deixa stripe decidir
            // permite tanto fluxo “cria e confirma” quanto “cria agora, confirma depois
        });
    }
}
