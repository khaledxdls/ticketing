import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    // Add validation
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    // Return a 200 if validation passes
    res.send({});
  }
);

export { router as signinRouter };
