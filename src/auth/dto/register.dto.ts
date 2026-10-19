import { ApiProperty } from '@nestjs/swagger';
import {IsEmail,IsNotEmpty,IsString,MinLength,MaxLength} from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        example: 'john',
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(15)
    username: string;

    @ApiProperty({
        example: 'john@example.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'Password@123',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;
}