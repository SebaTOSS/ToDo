import { IsString, IsDate, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class EventDataType1 {
  @IsString()
  @IsNotEmpty()
  type: string;
}

class EventDataType2 {
  @IsString()
  @IsNotEmpty()
  type: string;
}

class EventDataType3 {
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class CreateWebhookDto {
  @IsString()
  @IsNotEmpty()
  event: string;

  @IsDate()
  @Type(() => Date)
  sentAt: Date;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => Object)
  data: EventDataType1 | EventDataType2 | EventDataType3;
}