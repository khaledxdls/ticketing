import { Publisher, Subjects, OrderCreatedEvent } from "@khaleddlala/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
