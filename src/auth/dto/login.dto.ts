import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'johndoe',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

// Sous-classe pour typer proprement l'objet user dans la réponse du login

export class UserLoginResponseDto {
  @ApiProperty({ example: 1 })
  idUser: number;

  @ApiProperty({ example: 'johndoe' })
  username: string;
}

export class LoginResponse {
  @ApiProperty({ type: UserLoginResponseDto })
  user: UserLoginResponseDto;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;
}

export class ProfilResponse {
  @ApiProperty({ example: 1 })
  idUser: number;

  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ example: 'player' })
  role: string;

  @ApiProperty({ example: 'john.doe@example.com', required: false })
  email?: string;
}