import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { OrderStatus } from "@khaleddlala/common";
import { stripe } from "../../../stripe";
import { Payments } from "../../models/payments";

jest.mock("../../../stripe", () => {
  return {
    stripe: {
      paymentIntents: {
        create: jest.fn().mockResolvedValue({
          id: "pi_12345",
          status: "succeeded",
          client_secret: "secret_12345",
        }),
      },
    },
  };
});
it("return 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "asdasd",
      orderId: global.generateId(),
    })
    .expect(404);
});

it("return 401 if the order does not belong to the user", async () => {
  const order = await Order.build({
    id: global.generateId(),
    userId: global.generateId(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  }).save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "asdasd",
      orderId: order.id,
    })
    .expect(401);
});

it("return 400 if the order is already cancelled", async () => {
  const userId = global.signin();
  const order = await Order.build({
    id: global.generateId(),
    userId: userId[0],
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  }).save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId[0]))
    .send({
      token: "asdasd",
      orderId: order.id,
    })
    .expect(400);
});

it("return 201 with valid inputs", async () => {
  const userId = global.signin();
  const order = await Order.build({
    id: global.generateId(),
    userId: userId[0],
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  }).save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId[0]))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201)
    .then(async (response) => {
      expect(stripe.paymentIntents.create).toHaveBeenCalled();
      const paymentIntentOptions = (stripe.paymentIntents.create as jest.Mock)
        .mock.calls[0][0];
      expect(paymentIntentOptions.payment_method).toEqual("tok_visa");
      expect(paymentIntentOptions.amount).toEqual(20 * 100);
      expect(paymentIntentOptions.currency).toEqual("usd");
      expect(paymentIntentOptions.confirm).toBe(true);

      const payment = await Payments.findOne({
        orderId: order.id,
      });
      expect(payment).toBeDefined();
    });
});
