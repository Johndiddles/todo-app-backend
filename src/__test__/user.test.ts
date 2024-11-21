import bcrypt from "bcrypt";
import supertest from "supertest";
import { createServer } from "../lib/createServer";
import * as db from "./db/db";
import { User } from "../db/schema/user";

const app = createServer();
const request = supertest(app);
describe("user", () => {
  beforeAll(async () => {
    await db.connect();
  });
  beforeEach(async () => {
    const validUserData = {
      email: "johnee@test.com",
      password: "Password1",
      username: "johntests",
    };
    // Create a user with hashed password
    const hashedPassword = await bcrypt.hash(validUserData.password, 10);
    await User.create({
      email: validUserData.email,
      password: hashedPassword,
      username: validUserData.username,
    });
  });
  afterEach(async () => {
    await db.clearDatabase();
  });
  afterAll(async () => {
    // await db.clearDatabase();
    await db.closeDatabase();
  });

  describe("register user", () => {
    describe("given that user enters email and password", () => {
      it("should return a 201", async () => {
        const payload = {
          email: "johnnee@john.com",
          password: "Password1",
        };

        const { body, statusCode } = await request
          .post("/v1/users/register")
          .send(payload);

        expect(statusCode).toBe(201);
        expect(body).toMatchObject({
          status: "success",
          message: "Created new user successfully",
          user: {
            email: "johnnee@john.com",
          },
        });
      });
    });

    describe("given that password is ommitted", () => {
      it("should return a 400", async () => {
        const payload = {
          email: "johnnee@john.com",
        };

        const { statusCode } = await request
          .post("/v1/users/register")
          .send(payload);

        expect(statusCode).toBe(400);
      });
    });
  });

  describe("login user", () => {
    describe("given that user enters email and password", () => {
      it("should return a 200", async () => {
        const payload = {
          email: "johnee@test.com",
          password: "Password1",
        };

        const { body, statusCode } = await request
          .post("/v1/users/login")
          .send(payload);

        expect(statusCode).toBe(200);
        expect(body).toMatchObject({
          status: "success",
          message: "Logged in successfully",
          user: {
            email: "johnee@test.com",
          },
        });
      });
    });

    describe("given that password is ommitted", () => {
      it("should return a 200", async () => {
        const payload = {
          email: "johnee@test.com",
        };

        const { statusCode } = await request
          .post("/v1/users/login")
          .send(payload);

        expect(statusCode).toBe(400);
      });
    });

    describe("given that password is incorrect", () => {
      it("should return a 400", async () => {
        const payload = {
          email: "johnee@test.com",
          password: "incorrect password",
        };

        const { statusCode, body } = await request
          .post("/v1/users/login")
          .send(payload);

        expect(statusCode).toBe(400);
        expect(body).toMatchObject({
          status: "error",
          message: "Invalid login details",
        });
      });
    });
  });
});
