import { IsNotEmpty, IsInt, IsPositive, IsString, IsIn, IsOptional, IsDateString, IsNumber, Min } from 'class-validator';

export class CreateMatchDto {
  @IsNotEmpty({ message: "La date du match est obligatoire." })
  @IsDateString({}, { message: "La date du match doit être au format valide (ISO)." })
  dateM!: string;

  @IsNotEmpty({ message: "L'identifiant de la saison est obligatoire." })
  @IsInt({ message: "L'identifiant de la saison doit être un nombre entier." })
  @IsPositive({ message: "L'identifiant de la saison doit être un entier positif." })
  idSaison!: number;

  @IsNotEmpty({ message: "L'identifiant de l'adversaire est obligatoire." })
  @IsInt({ message: "L'identifiant de l'adversaire doit être un nombre entier." })
  @IsPositive({ message: "L'identifiant de l'adversaire doit être un entier positif." })
  idOpp!: number;

  @IsNotEmpty({ message: "L'identifiant du stade est obligatoire." })
  @IsInt({ message: "L'identifiant du stade doit être un nombre entier." })
  @IsPositive({ message: "L'identifiant du stade doit être un entier positif." })
  idStadium!: number;

  @IsNotEmpty({ message: "La localisation (domicile/extérieur) est obligatoire." })
  @IsString()
  @IsIn(['home', 'away', 'domicile', 'exterieur'], { 
    message: "La localisation doit être l'une des valeurs suivantes : 'home', 'away', 'domicile', 'exterieur'." 
  })
  homeAway!: string;

  @IsNotEmpty({ message: "Le statut du match est obligatoire." })
  @IsString()
  matchStatus!: string;

  @IsOptional()
  @IsNumber({}, { message: "Le score du club doit être un nombre." })
  @Min(0, { message: "Le score du club ne peut pas être négatif." })
  scoreClub?: number;

  @IsOptional()
  @IsNumber({}, { message: "Le score de l'adversaire doit être un nombre." })
  @Min(0, { message: "Le score de l'adversaire ne peut pas être négatif." })
  scoreOpp?: number;
}