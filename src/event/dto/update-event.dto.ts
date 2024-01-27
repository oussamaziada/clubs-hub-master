import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateEventDto extends PartialType(CreateEventDto) {
      @IsOptional()
      @IsString()
      name: string;
    
      @IsOptional()
      @IsString()
      description: string;

      @IsOptional()
      @IsString()
      place: string;

      @IsOptional()
      @IsNumber()
      places: number;
      
      @IsOptional()
      @IsDate()
      date: Date;


}
