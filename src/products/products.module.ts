import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CommonModule } from 'src/common/common.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';

@Module({
  imports: [CommonModule, MulterModule.register(multerConfig)],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
