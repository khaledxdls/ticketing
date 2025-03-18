import { OrderCancelledEvent } from "@khaleddlala/common";
import { Ticket } from "../../../models/tickets";
import { natsWrapper } from "../../../nets-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);
  // Create a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: global.generateId(),
  });
  ticket.set({ orderId: global.generateId() });
  await ticket.save();
  // Create a fake data event
  const data: OrderCancelledEvent["data"] = {
    id: global.generateId(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };
  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("updates the ticket, publishes an event, and acks the message", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toBeUndefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
