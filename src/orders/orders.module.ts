import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [CommonModule],
})
export class OrdersModule {}
