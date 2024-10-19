import { CreateWebhookDto } from "../dto/create-webhook.dto";

export interface EventManager {
    getEvetName(): string;
    process(webhook: CreateWebhookDto): void;
}