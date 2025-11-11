import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderResponseDto } from './dtos/order-response.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { OrderSummaryDto } from './dtos/order-summary.dto';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Place a new order',
    description:
      'Creates a new order for authenticated users. Validates stock and calculates total price.',
  })
  @ApiBody({
    type: CreateOrderDto,
    description: 'The order items to place',
  })
  @ApiResponse({
    status: 201,
    description: 'Order placed successfully',
    type: BaseResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized: Invalid or missing token',
    schema: { example: { error: 'Unauthorized' } },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden: User role required',
    schema: { example: { error: 'Access forbidden: User role required' } },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request: Insufficient stock or invalid data',
    schema: { example: { error: 'Insufficient stock for Product X' } },
  })
  @ApiNotFoundResponse({
    description: 'Not Found: Product not found',
    schema: { example: { error: 'Product with ID uuid not found' } },
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    const order = await this.ordersService.createOrder(
      createOrderDto,
      req.user.id,
    );
    return order;
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'View my order history',
    description: 'Retrieves a list of orders for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of user orders (empty array if none)',
    type: [BaseResponseDto],
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized: Invalid or missing token',
    schema: { example: { error: 'Unauthorized' } },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden: User role required',
    schema: { example: { error: 'Access forbidden: User role required' } },
  })
  @HttpCode(HttpStatus.OK)
  async findMyOrders(@Request() req) {
    return this.ordersService.findUserOrders(req.user.id);
  }
}
