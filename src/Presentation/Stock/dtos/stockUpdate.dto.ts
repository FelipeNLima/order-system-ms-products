import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber } from 'class-validator';

export class StockUpdateDto {
  @ApiProperty()
  @IsDefined()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  productID: number;
}
