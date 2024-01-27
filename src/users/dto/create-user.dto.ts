import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName : string ;

    @IsString()
    @IsNotEmpty()
    lastName : string ;

    @IsString()
    university : string ;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
}
