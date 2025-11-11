# E-Commerce API

A robust, scalable RESTful API built with NestJS for e-commerce applications. Features include user authentication, product management, order processing, and comprehensive API documentation.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (Admin/Customer)
- **User Management**: User registration and login
- **Product Management**: CRUD operations for products with categories and inventory tracking
- **Order Processing**: Complete order lifecycle management with order items
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **API Documentation**: Auto-generated Swagger documentation
- **Docker Support**: Containerized development and production environments
- **Security**: Password hashing, input validation, and error handling
- **Testing**: Unit and integration tests with Jest

## Architecture

This project follows a modular architecture pattern with clear separation of concerns:

```
src/
├── auth/           # Authentication module
├── users/          # User management module
├── products/       # Product management module
├── orders/         # Order processing module
├── common/         # Shared utilities, decorators, filters
├── prisma/         # Database configuration
└── main.ts         # Application entry point
```

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) - Progressive Node.js framework
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: JWT
- **Validation**: [class-validator](https://github.com/typestack/class-validator) & [class-transformer](https://github.com/typestack/class-transformer)
- **Documentation**: [Swagger](https://swagger.io/) with [@nestjs/swagger](https://docs.nestjs.com/openapi/introduction)
- **Testing**: [Jest](https://jestjs.io/) with [Supertest](https://github.com/visionmedia/supertest)
- **Development**: TypeScript, ESLint, Prettier

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v15 or higher)
- Docker & Docker Compose (optional)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Sanoy24/e-commerce-api.git
cd e-commerce-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://<user>:<your password>@<host>:5432/ecommerce_db"
or
DATABASE_URL="postgresql://postgres:postgres@db:5432/ecommerce_db" for docker setup


# Application
PORT=3000

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

SALT_VALUE=10

```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

### 5. Start the Application

#### Development Mode

```bash
npm run start:dev
```

#### Production Mode

```bash
npm run build
npm run start:prod
```

#### Docker Setup

```bash
# Start all services (API + PostgreSQL)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Default Seeded Users

- When using Docker for setup, the application automatically seeds two users into the database:

1. Admin user

   ```bash
   {
   "email": "admin@example.com",
   "password": "Admin@123",
   "username": "admin",
   "role": "ADMIN"
   }

   ```

2. Customer user

```bash
   {
   "email": "test@example.com",
   "password": "Pass@123",
   "username": "user1",
   "role": "CUSTOMER"
   }
```

## 📚 API Documentation

Once the application is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:3000/api/v1/docs
- **API Base URL**: http://localhost:3000/api/v1

### Authentication Flow

1. **Register**: `POST /api/v1/auth/register`
2. **Login**: `POST /api/v1/auth/login`
3. **Use Token**: Include `Authorization: Bearer <token>` in subsequent requests

## API Endpoints

### Healthcheck

- `GET /healthcheck` - check if the server and db is healthy

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Products

- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (Admin only)
- `PUT /products/:id` - Update product (Admin only)
- `DELETE /products/:id` - Delete product (Admin only)

### Orders

- `GET /orders` - Get user orders
- `POST /orders` - Create new order

### upload

- `POST /uploads` - upload product image

## 🧪 Testing

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# End-to-end tests
npm run test:e2e

# Watch mode
npm run test:watch
```

### Run Tests Locally

- Prepare database (only needed for tests that hit the DB):
  - Start local Postgres or run `docker compose up -d db`.
  - Ensure `.env` has a valid `DATABASE_URL`, e.g. `postgresql://postgres:postgres@localhost:5432/ecommerce_db`.
- Commands:
  - Unit tests: `npm run test`
  - Coverage: `npm run test:cov`
  - E2E tests: `npm run test:e2e`
  - Watch mode: `npm run test:watch`

### Run Tests in Docker

- Bring up the stack: `docker compose up -d`.
- Ensure `.env` uses the Compose network host for DB:
  - `DATABASE_URL="postgresql://postgres:postgres@db:5432/ecommerce_db"`
- Inside the running API container:
  - Unit tests: `docker compose exec api npm run test`
  - E2E tests: `docker compose exec api npm run test:e2e`
- One-off test container (clean environment):
  - Unit tests: `docker compose run --rm api sh -c "npm ci && npm run test"`
  - E2E tests: `docker compose run --rm api sh -c "npm ci && npm run test:e2e"`
- Optional DB reset/seed before E2E:
  - `docker compose exec api npx prisma migrate reset --force`
  - `docker compose exec api npx prisma db seed`

Notes:

- The Compose service is named `api` and depends on the `db` service being healthy.
- The stack seeds the database on startup via `npx prisma db seed` in the API command.

## 🗄️ Database Schema

### User Model

- `id` (UUID, Primary Key)
- `username` (String, Unique)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (Enum: ADMIN, CUSTOMER)
- `createdAt`, `updatedAt` (Timestamps)

### Product Model

- `id` (UUID, Primary Key)
- `name` (String)
- `description` (String, Optional)
- `price` (Float)
- `stock` (Integer)
- `category` (String, Optional)
- `userId` (Foreign Key to User)

### Order Model

- `id` (UUID, Primary Key)
- `userId` (Foreign Key to User)
- `description` (String, Optional)
- `totalPrice` (Float)
- `status` (String, Default: "pending")
- `createdAt`, `updatedAt` (Timestamps)

### OrderItem Model

- `id` (UUID, Primary Key)
- `orderId` (Foreign Key to Order)
- `productId` (Foreign Key to Product)
- `quantity` (Integer, Default: 1)

## 🔒 Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **JWT Authentication**: Stateless authentication
- **Input Validation**: Comprehensive validation using class-validator
- **Error Handling**: Centralized error handling with custom filters
- **CORS Protection**: Configurable CORS policies
- **Rate Limiting**: Ready for rate limiting implementation

## 🚀 Deployment

### Production Deployment

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Set production environment variables**

3. **Run migrations**:

   ```bash
   npx prisma migrate deploy
   ```

4. **Start the application**:
   ```bash
   npm run start:prod
   ```

### Docker Production

```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.yml up -d
```

---
