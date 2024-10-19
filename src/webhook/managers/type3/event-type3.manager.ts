import { Injectable } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { CreateWebhookDto } from "../../dto/create-webhook.dto";
import { WebhookService } from "../../webhook.service";
import { EventManager } from "../event.manager.interface";

@Injectable()
export class EventDataType3Manager implements EventManager {

    private readonly EVENT_NAME = 'eventType3';

    constructor(private readonly webhook: WebhookService) {
        this.webhook.addSubscriber(this);
    }

    getEvetName(): string {
        return this.EVENT_NAME;
    }

    /**
     * Processes the webhook of type 3.
     * 
     * @param {CreateWebhookDto} webhook - The webhook to be processed.
     */
    @MessagePattern('eventType3')
    process(webhook: CreateWebhookDto) {
        console.log('Processing eventType3:', webhook);
    }

}