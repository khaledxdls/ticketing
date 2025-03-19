import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from "@khaleddlala/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/Order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: any) {
    const { orderId } = data;
    console.log("ExpirationComplete event received for orderId", orderId);
    // Do something with the order
    const order = await Order.findById(orderId).populate("ticket");
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.status === "complete") {
      return msg.ack();
    }
    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();

    // Publish an event saying this order was cancelled!
    // We are not using the OrderCancelledPublisher because we are not
    // interested in listening to this event in other services
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    msg.ack();
  }
}
