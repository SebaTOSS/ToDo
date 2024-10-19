import { Controller, Post, Body, UseGuards, ValidationPipe, UsePipes } from '@nestjs/common';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { WebhookService } from './webhook.service';
import { SignatureGuard } from './signature.guard';

/**
 * Controller for handling incoming webhooks
 * Uses a guard to verify the signature of the incoming webhook
 * Uses a pipe to validate the incoming webhook payload
 */
@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
  ) { }

  /**
 * Handles incoming webhooks by adding them to a queue
 * 
 * @param {CreateWebhookDto} createWebhookDto - Payload of the incoming webhook
 * @returns {Promise<{ message: string }>} - An string of success or failure.
 * 
 * @throws {BadRequestException} - Returns a 400 error if the payload is invalid or the signature is invalid
 */
  @Post()
  @UseGuards(SignatureGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async handleWebhook(@Body() createWebhookDto: CreateWebhookDto): Promise<{ message: string }> {
    await this.webhookService.addToQueue(createWebhookDto);

    return { message: 'Webhook received' };
  }
}