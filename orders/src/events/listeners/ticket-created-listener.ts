import { Message } from "node-nats-streaming";
import { Subjects, Listener, ticketCreatedEvent } from "@khaleddlala/common";
import { Ticket } from "../../models/Ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<ticketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ticketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id: id,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}
