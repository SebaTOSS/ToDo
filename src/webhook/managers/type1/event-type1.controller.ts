import { Controller, Inject } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { EventDataType1Manager } from "./event-type1.manager";
import { CreateWebhookDto } from "../../dto/create-webhook.dto";

@Controller('event-type1')
export class EventType1Controller {
    
    @Inject()
    private readonly service: EventDataType1Manager;
    
    @EventPattern('eventType1')
    async processWebhook(@Payload() webhook: CreateWebhookDto) {
        this.service.process(webhook);
    }
}