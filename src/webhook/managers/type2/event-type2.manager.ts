import { Injectable } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { CreateWebhookDto } from "../../dto/create-webhook.dto";
import { WebhookService } from "../../webhook.service";
import { EventManager } from "../event.manager.interface";

@Injectable()
export class EventDataType2Manager implements EventManager {

    private readonly EVENT_NAME = 'eventType2';

    constructor(private readonly webhook: WebhookService) {
        this.webhook.addSubscriber(this);
    }

    getEvetName(): string {
        return this.EVENT_NAME;
    }

    /**
     * Processes the webhook of type 1.
     * 
     * @param {CreateWebhookDto} webhook - The webhook to be processed.
     */
    @MessagePattern('eventType2')
    process(webhook: CreateWebhookDto) {
        console.log('Processing eventType2:', webhook);
    }

}