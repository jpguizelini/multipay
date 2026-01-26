
# Multipay API

API de pagamentos multi-tenant com NestJS e Stripe (Payment Intents) em modo de teste.

## 🏗️ Arquitetura

- **Framework**: NestJS
- **Banco de Dados**: PostgreSQL (via Prisma ORM)
- **Gateway de Pagamento**: Stripe
- **Arquitetura**: Multi-tenant (suporte a múltiplos clientes)

## 📋 Requisitos

- Node.js 20+
- Docker e Docker Compose
- Conta Stripe (modo teste)
- Stripe secret key de teste (`sk_test_...`)

> 💡 **Como obter a chave do Stripe**: Acesse o [Dashboard do Stripe](https://dashboard.stripe.com/test/apikeys) em modo teste e copie a "Secret key".

## 🚀 Como Rodar

```bash
# 1. Instalar dependências
npm install

# 2. Subir PostgreSQL com Docker
docker compose up -d

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais:
# - STRIPE_SECRET_KEY: sua chave secreta do Stripe (sk_test_...)
# - DATABASE_URL: URL de conexão do PostgreSQL

# 4. Rodar migrações do Prisma
npx prisma migrate dev

# 5. Popular banco com dados iniciais (opcional)
npm run seed

# 6. Iniciar API em modo desenvolvimento
npm run start:dev
```

A API estará disponível em `http://localhost:3000`

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...

# Database
DATABASE_URL=postgresql://postgres:root@localhost:5432/mydb

# Server (opcional)
PORT=3000
```

## 📡 Endpoints

### `POST /payments`

Cria um novo pagamento via Stripe Payment Intent.

**Body (JSON):**
```json
{
  "amount": 1000,
  "currency": "BRL",
  "paymentMethod": "pm_card_visa"
}
```

**Parâmetros:**
- `amount` (number, obrigatório): Valor em centavos (ex: 1000 = R$ 10,00)
- `currency` (string, obrigatório): Código da moeda (ex: "BRL", "USD")
- `paymentMethod` (string, obrigatório): ID do método de pagamento do Stripe

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid-do-pagamento",
  "tenantId": "demo-tenant",
  "provider": "STRIPE",
  "amount": 1000,
  "currency": "BRL",
  "status": "SUCCEEDED",
  "providerPaymentId": "pi_...",
  "createdAt": "2026-01-16T10:30:00.000Z",
  "updatedAt": "2026-01-16T10:30:00.000Z"
}
```

**Status possíveis:**
- `PENDING`: Pagamento pendente
- `SUCCEEDED`: Pagamento confirmado
- `FAILED`: Pagamento falhou


## 📝 Scripts Disponíveis

- `npm run start:dev` - Inicia em modo desenvolvimento (watch)
- `npm run build` - Compila o projeto
- `npm run lint` - Verifica código com ESLint
- `npm run seed` - Popula banco com dados iniciais
- `npm run db:reset` - Reseta banco e executa seed

## 🔐 Segurança

- CORS configurado para `http://localhost:3001`
- Validação automática de dados de entrada (class-validator)
- Suporte a multi-tenant (isolamento por tenant)

## 📚 Documentação Adicional

- [Documentação do Stripe](https://stripe.com/docs)
- [Documentação do NestJS](https://docs.nestjs.com)
- [Documentação do Prisma](https://www.prisma.io/docs)
```