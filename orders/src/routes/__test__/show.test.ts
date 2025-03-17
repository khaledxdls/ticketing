import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";

it("returns a 404 if the order is not found", async () => {
  const id = global.generateId();
  await request(app)
    .get(`/api/orders/${id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(404);
});

it("returns a 401 if the user does not own the order", async () => {
  const ticket = Ticket.build({
    id: global.generateId(),
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(401);
});

it("fetches the order", async () => {
  const ticket = Ticket.build({
    id: global.generateId(),
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});
