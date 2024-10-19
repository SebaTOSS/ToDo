import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { catchError, firstValueFrom, throwError } from 'rxjs';
/**
 * Service that handles the processing of webhooks.
 * 
 * This service currently uses an in-memory queue to process webhooks.
 * For future developments, it is recommended to use a message queue
 * like RabbitMQ to handle high loads and ensure reliability.
 */
@Injectable()
export class WebhookService {
    private readonly handlerSwitch = {};

    constructor(@Inject('EVENT_PUBLISHER') private readonly broker: ClientProxy) { }

    addSubscriber(subscriber: any) {
        const eventName = subscriber.getEvetName();
        this.handlerSwitch[eventName] = subscriber;
    }

    /**
     * Adds a webhook to the queue and starts processing the queue.
     * 
     * @param {CreateWebhookDto} webhook - The webhook to be added to the queue.
     */
    async addToQueue(webhook: CreateWebhookDto) {
        const { event } = webhook;
        await firstValueFrom(
            this.broker.emit(event, webhook).pipe(
                catchError((exception: Error) => {
                    return throwError(() => new Error(exception.message));
                }),
            ),
        );
    }
}