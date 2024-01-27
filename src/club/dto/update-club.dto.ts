import { PartialType } from '@nestjs/mapped-types';
import { CreateClubDto } from './create-club.dto';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateClubDto extends PartialType(CreateClubDto) {
    @IsOptional()
    @IsString()
    name : string ;

    @IsOptional()
    @IsString()
    field : string ;

    @IsOptional()
    @IsDate()
    date: Date;

    @IsOptional()
    @IsString()
    path : string;
}
