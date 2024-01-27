import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateClubDto {

    @IsString()
    name : string ;

    @IsString()
    field : string ;

    @IsDate()
    creationDate: Date;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;


}
