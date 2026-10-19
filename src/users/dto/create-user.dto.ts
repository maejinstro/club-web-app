import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, Matches, IsIn } from 'class-validator';

const passwordRegEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export class CreateUserDto {
    @IsEmail({}, { message: 'A valid email is required' })
    @IsNotEmpty()
    @MaxLength(50)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(20)
    @Matches(passwordRegEx, {
        message: `Password must contain Minimum 8 and maximum 20 characters, 
    at least one uppercase letter, 
    one lowercase letter, 
    one number and 
    one special character`,
    })
    password: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(15)
    username: string;

    @IsOptional()
    @IsString()
    @IsIn(['goalkeeper', 'defender', 'winger', 'pivot'])
    position?: string;
}