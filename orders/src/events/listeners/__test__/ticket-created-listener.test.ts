import { Ticket } from "../../../models/Ticket";
import { natsWrapper } from "../../../nets-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // Create a fake data event
  const data = {
    id: global.generateId(),
    version: 0,
    title: "concert",
    price: 20,
    userId: global.generateId(),
  };
  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure a ticket was created

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
