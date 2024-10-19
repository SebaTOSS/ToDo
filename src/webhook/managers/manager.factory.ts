import { Injectable } from '@nestjs/common';
import { WebhookService } from '../webhook.service';
import { EventDataType1Manager } from './type1/event-type1.manager';
import { EventDataType2Manager } from './type2/event-type2.manager';
import { EventDataType3Manager } from './type3/event-type3.manager';

@Injectable()
export class ManagerFactory {
  constructor(private readonly webhookService: WebhookService) {
    const eventDataType1Manager = this.createEventDataType1Manager();
    const eventDataType2Manager = this.createEventDataType2Manager();
    const eventDataType3Manager = this.createEventDataType3Manager();
    
    webhookService.addSubscriber(eventDataType1Manager);
    webhookService.addSubscriber(eventDataType2Manager);
    webhookService.addSubscriber(eventDataType3Manager);
  }

  createEventDataType1Manager(): EventDataType1Manager {
    return new EventDataType1Manager(this.webhookService);
  }

  createEventDataType2Manager(): EventDataType2Manager {
    return new EventDataType2Manager(this.webhookService);
  }

  createEventDataType3Manager(): EventDataType3Manager {
    return new EventDataType3Manager(this.webhookService);
  }
}