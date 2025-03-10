import { Publisher, Subjects, ticketUpdatedEvent } from "@khaleddlala/common";

export class ticketUpdatedPublisher extends Publisher<ticketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
