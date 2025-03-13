import { OrderCancelledEvent, Publisher, Subjects } from "@khaleddlala/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
