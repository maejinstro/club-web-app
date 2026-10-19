import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, Matches, IsIn, IsDateString } from 'class-validator';

const passwordRegEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export class UpdateUserDto {
    @IsEmail({}, { message: 'A valid email is required' })
    @IsOptional()
    @MaxLength(50)
    email: string;

    @IsString()
    @IsOptional()
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
    @IsOptional()
    @MaxLength(15)
    username: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    lastName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    firstName?: string;

    @IsOptional()
    @IsDateString({}, { message: 'Birthdate must be a valid ISO date string (YYYY-MM-DD)' })
    birthdate?: string;

    @IsOptional()
    @IsString()
    @MaxLength(30)
    phone?: string | null;

    @IsOptional()
    @IsString()
    @IsIn(['goalkeeper', 'defender', 'winger', 'pivot'])
    position?: string;
}
