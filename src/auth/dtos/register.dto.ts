import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsAlphanumeric,
  IsEmail,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Unique username (alphanumeric only)',
    example: 'testuser123',
  })
  @ApiProperty({
    description: 'Unique email address',
    example: 'test@example.com',
  })
  @IsNotEmpty({ message: 'Username is required' })
  @IsAlphanumeric(undefined, { message: 'Username must be alphanumeric only' }) // check for locale
  username: string;

  @ApiProperty({
    description: 'Unique email address',
    example: 'test@example.com',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail(
    {},
    { message: 'Email must be a valid format (e.g., user@example.com)' },
  )
  email: string;

  @ApiProperty({
    description:
      'Secure password (min 8 chars, with uppercase, lowercase, number, special char)',
    example: 'Password123!',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)',
    },
  )
  password: string;

  @IsOptional()
  role?: string;
}
