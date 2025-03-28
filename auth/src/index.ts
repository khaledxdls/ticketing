import mongoose from "mongoose";
import { app } from "./app";
const start = async () => {
  console.log("Starting up authentication service...");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
  app.listen(5000, () => {
    console.log("Listening on port 5000 sddddd");
  });
};

start();
