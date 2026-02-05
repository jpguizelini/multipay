import { IsIn, IsString, IsInt, Min, IsNotEmpty } from "class-validator";

export class CreatePaymentDto {
    @IsInt()
    @Min(1)
    amount: number; // centavos
    
    @IsNotEmpty()
    @IsString()
    @IsIn(['BRL','USD','EUR'])
    currency: string; // "BRL"
    
    @IsNotEmpty()
    @IsString()
    paymentMethod: string;
}