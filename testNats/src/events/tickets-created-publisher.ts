import { Publisher } from "./base-publisher";
import { Subjects } from "./subjects";
import { ticketCreatedEvent } from "./tickets-created-event";

export class TicketCreatedPublisher extends Publisher<ticketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
