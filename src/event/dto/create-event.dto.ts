import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";
import moment from 'moment';

export class CreateEventDto {

    @IsString()
    name : string ;

    @IsString()
    description : string ;

    @IsString()
    place: string;

    @IsNumber()
    places: number;

    @IsDate()
   // @Transform(({ value }) => moment(value, 'DD/MM/YYYY').toDate())
    date: Date;

    @IsString()
    logo_path : string;

    @IsString()
    image1_path : string;

    @IsString()
    image2_path : string;

    @IsString()
    image3_path : string;

    
}


