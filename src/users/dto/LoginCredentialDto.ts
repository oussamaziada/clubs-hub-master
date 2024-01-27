import { IsNotEmpty } from "class-validator";

export class LoginCredentialDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
}
