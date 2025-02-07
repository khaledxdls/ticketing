import { ValidationError } from "express-validator";

export class DatabaseValidationError extends Error {
  reason = "Error connecting to database";
  statusCode = 500;
  constructor(public errors: ValidationError[]) {
    super();

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, DatabaseValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => {
      if (error.type === "field") {
        return [{ message: this.reason }];
      }
    });
  }
}
