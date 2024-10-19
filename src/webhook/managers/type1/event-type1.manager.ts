import { Injectable } from "@nestjs/common";
import { CreateWebhookDto } from "../../dto/create-webhook.dto";
import { WebhookService } from "../../webhook.service";
import { EventManager } from "../event.manager.interface";

@Injectable()
export class EventDataType1Manager implements EventManager {

    private readonly EVENT_NAME = 'eventType1';

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
    process(webhook: CreateWebhookDto) {
        console.log('Processing eventType1:', webhook);
    }
}