import express from "express";
import "express-async-errors";

import { json } from "body-parser";
import { currentUser, errorHandler, NotFoundError } from "@khaleddlala/common";
import cookies from "cookie-session";
import { createTicketRouter } from "./routes/new";
const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookies({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);

app.use(createTicketRouter);
app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    errorHandler(err, req, res, next);
  }
);

export { app };
