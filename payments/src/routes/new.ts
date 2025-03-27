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
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.price * 100, // Convert to cents
      currency: "usd",
      payment_method: token, // Use the token as the payment method
      confirm: true, // Automatically confirm the payment
      return_url: "https://www.ticketing-app.dev/orders", // Redirect to this URL after payment
    });

    const payment = Payments.build({
      orderId,
      stripeId: paymentIntent.id,
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
