import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@khaleddlala/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
