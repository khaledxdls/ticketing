import { Publisher, Subjects, ticketCreatedEvent } from "@khaleddlala/common";

export class TicketCreatedPublisher extends Publisher<ticketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
