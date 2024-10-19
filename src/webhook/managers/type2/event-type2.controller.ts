import { Controller, Inject } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { EventDataType1Manager } from "../type1/event-type1.manager";
import { CreateWebhookDto } from "../../dto/create-webhook.dto";

@Controller('event-type2')
export class EventType2Controller {
    
    @Inject()
    private readonly service: EventDataType1Manager;
    
    @EventPattern('eventType2')
    async processWebhook(@Payload() webhook: CreateWebhookDto) {
        this.service.process(webhook);
    }
}