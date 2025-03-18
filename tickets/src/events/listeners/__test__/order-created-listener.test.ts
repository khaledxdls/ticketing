import {
  OrderCreatedEvent,
  OrderStatus,
  ticketUpdatedEvent,
} from "@khaleddlala/common";
import { Ticket } from "../../../models/tickets";
import { natsWrapper } from "../../../nets-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);
  // Create a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: global.generateId(),
  });
  await ticket.save();
  // Create a fake data event
  const data: OrderCreatedEvent["data"] = {
    id: global.generateId(),
    version: 0,
    status: OrderStatus.Created,
    userId: global.generateId(),
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, data, msg };
};

it("sets the userId of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id).exec();
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it(" publishes a ticket updated event", async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData: ticketUpdatedEvent["data"] = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
