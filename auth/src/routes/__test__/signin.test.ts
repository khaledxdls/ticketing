import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "khaled@gmail.com",
      password: "password",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "khaled@gmail.com",
      password: "password",
    })
    .expect(200);
});

it("returns a 400 with an invalid email", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "khaled",
      password: "password",
    })
    .expect(400);
});
it("fails when an email that does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "khle@gmail.com",
      password: "password",
    })
    .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "khaled@gmail.com",
      password: "password",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "khaled@gmail.com",
      password: "passwor",
    })
    .expect(400);
});

it("it responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "khaled@gmail.com",
      password: "password",
    })
    .expect(201);
  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "khaled@gmail.com",
      password: "password",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
