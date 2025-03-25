import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  requireAuth,
  validateRequest,
  NotAuthorizedError,
  BadRequestError,
  NotFoundError,
} from "@khaleddlala/common";

import { Order } from "../models/order";
import { OrderStatus } from "@khaleddlala/common";
import { stripe } from "../../stripe";
import { Payments } from "../models/payments";
import { PaymentsCreatedPublisher } from "../events/publishers/payments-created-publisher";
import { natsWrapper } from "../nets-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("token").not().isEmpty().withMessage("Token is required"),
    body("orderId").not().isEmpty().withMessage("Order Id is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Order is already cancelled");
    }
    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
      description: "Charge for an order",
    });

    const payment = Payments.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    new PaymentsCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ success: true });
  }
);

export { router as createChargeRouter };
