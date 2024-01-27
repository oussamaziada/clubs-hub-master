import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateClubDto {

    @IsString()
    name : string ;

    @IsString()
    field : string ;

    @IsString()
    path : string ;

    @IsString()
    university : string ;

    @IsDate()
    creationDate: Date;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;


}
