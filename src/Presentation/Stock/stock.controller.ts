import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { StockService } from '../../Application/services/stock.service';
import { Roles } from '../../Infrastructure/Guard/decorators/roles.decorator';
import { StockDto } from './dtos/stock.dto';
import { StockUpdateDto } from './dtos/stockUpdate.dto';

@ApiTags('Estoque')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get(':id')
  @ApiHeader({
    name: 'user',
    description: 'ID do usuário ADMIN',
  })
  @Roles(['admin'])
  async getByID(@Param('id') id: number) {
    try {
      const stock = await this.stockService.getById(Number(id));
      return stock;
    } catch (err) {
      throw new ConflictException(err?.message ?? 'stock could not be list');
    }
  }

  @Get('product/:productID')
  @ApiHeader({
    name: 'user',
    description: 'ID do usuário ADMIN',
  })
  @Roles(['admin'])
  async getByProductID(@Param('productID') productID: number) {
    try {
      const stock = await this.stockService.getProductId(Number(productID));
      return stock;
    } catch (err) {
      throw new ConflictException(err?.message ?? 'stock could not be list');
    }
  }

  @Post()
  @ApiHeader({
    name: 'user',
    description: 'ID do usuário ADMIN',
  })
  @Roles(['admin'])
  async save(@Body() dto: StockDto) {
    try {
      const stock = await this.stockService.create(dto);
      return stock;
    } catch (err) {
      throw new ConflictException(err?.message ?? 'stock could not be created');
    }
  }

  @Patch()
  @ApiHeader({
    name: 'user',
    description: 'ID do usuário ADMIN',
  })
  @Roles(['admin'])
  async update(@Body() dto: StockUpdateDto) {
    try {
      const stock = await this.stockService.update(dto);
      return stock;
    } catch (err) {
      throw new ConflictException(err?.message ?? 'stock could not be updated');
    }
  }
}
