// model Category {
//   id String @id @default(uuid())
//   name String
//   description String?
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   products Product[]

//   @@map("category")
// }
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
