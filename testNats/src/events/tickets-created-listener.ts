import { Message } from "node-nats-streaming";

import { Subjects } from "./subjects";
import { Listener } from "./base-listener";
import { ticketCreatedEvent } from "./tickets-created-event";

export class TicketCreatedListener extends Listener<ticketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payments-service";
  onMessage(data: ticketCreatedEvent["data"], msg: Message) {
    console.log("Event data!", data);
    msg.ack();
  }
}
