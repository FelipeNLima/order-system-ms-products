import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDefined, IsNumber, IsOptional } from 'class-validator';

export class StockDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsDate()
  updatedAt: Date;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  quantityAvailable: number;

  // @ApiProperty()
  // @IsDefined()
  // @IsNumber()
  // productID: number;
}
