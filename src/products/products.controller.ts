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
  Delete,
  UseInterceptors,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  FileTypeValidator,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
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
import { ProductDto } from './dtos/product.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiConsumes('multipart/form-data')
  @Post()
  @ApiOperation({
    summary: 'Create a new product',
    description:
      'Creates a new product in the catalog. Requires Admin role. Supports image upload.',
  })
  @ApiConsumes('multipart/form-data') // For Swagger file upload
  @ApiBody({
    description: 'Product data and optional image',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Wireless Mouse' },
        description: { type: 'string', example: 'Description...' },
        price: { type: 'number', example: 29.99 },
        stock: { type: 'number', example: 100 },
        category: { type: 'string', example: 'Electronics' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Product image (jpg, png, etc.)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @UseInterceptors(FileInterceptor('image')) // 'image' is form field name
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req,
  ) {
    const product = await this.productsService.create(
      createProductDto,
      req.user.id,
      file,
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
  @ApiConsumes('multipart/form-data')
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
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    const product = await this.productsService.update(
      id,
      updateProductDto,
      file,
    );
    return product;
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get a list of all products',
    description:
      'Retrieves a paginated list of products, with optional search by name (case-insensitive partial match). Public endpoint, no authentication required.',
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
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description:
      'Search term for product name (case-insensitive, partial match). If empty or omitted, returns all products.',
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
  @Get(':id')
  @ApiOperation({
    summary: 'Get product details by ID',
    description:
      'Retrieves detailed information for a specific product. Public endpoint, no authentication required.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the product',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Product details retrieved successfully',
    type: ProductDto,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    schema: {
      example: { error: 'Product not found' },
    },
  })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a product by ID',
    description:
      'Permanently deletes a product from the catalog. Requires Admin role.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the product to delete',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
    schema: {
      example: { message: 'Product deleted successfully' },
    },
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
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    await this.productsService.delete(id);
    return { message: 'Product deleted successfully' };
  }
}
