import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
  Param,
  Put,
  Query,
  Get,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateProductDto } from './dtos/update-product.dto';
import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { PaginatedResponseDto } from 'src/common/dtos/paginated-response.dto';

@ApiTags('products')
@ApiBearerAuth('JWT-auth')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Request() req) {
    const product = await this.productsService.create(
      createProductDto,
      req.user.id,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Product created successfully',
      data: product,
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Update an existing product',
    description:
      'Updates the details of an existing product. Requires Admin role. Partial updates are supported.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product to update',
    type: String,
  })
  @ApiBody({
    type: UpdateProductDto,
    description: 'The product data to update (partial)',
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: CreateProductDto, // Reuse for response schema; adjust if needed
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized: Invalid or missing token',
    schema: {
      example: { error: 'Unauthorized' },
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden: Admin role required',
    schema: {
      example: { error: 'Access forbidden: Admin role required' },
    },
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    schema: {
      example: { error: 'Product not found' },
    },
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.update(id, updateProductDto);
    return product;
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Get a list of all products',
    description:
      'Retrieves a paginated list of products. Public endpoint, no authentication required.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (defaults to 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of products per page (defaults to 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of products',
    type: PaginatedResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: PaginationQueryDto) {
    // Support 'pageSize' as alias
    if (query['pageSize'] && !query.limit) {
      query.limit = query['pageSize'];
    }
    return this.productsService.findAll(query);
  }
}
