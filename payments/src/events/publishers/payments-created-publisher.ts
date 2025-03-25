import { PaymentCreatedEvent, Publisher, Subjects } from "@khaleddlala/common";

export class PaymentsCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
