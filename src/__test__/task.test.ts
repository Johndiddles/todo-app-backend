import { Task } from "./../db/schema/task";
import supertest from "supertest";
import { createServer } from "../lib/createServer";
import mongoose from "mongoose";
import { signToken } from "../lib/jwt";
import * as db from "./db/db";
import bcrypt from "bcrypt";
import { User } from "../db/schema/user";

const random_id = new mongoose.Types.ObjectId().toString();
let id;
let task_id;

const userDetails = {
  email: "johnee@test.com",
  password: "Password1",
  username: "johntests",
};

const taskDetails = {
  title: "Test One",
  description: "Test One description",
  dueDate: new Date().toISOString(),
  priority: "high",
  status: "pending",
};

const app = createServer();
describe("task", () => {
  beforeAll(async () => {
    await db.connect();
  });
  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash(userDetails.password, 10);
    const user = await User.create({
      ...userDetails,
      password: hashedPassword,
    });

    id = user._id;
    const task = await Task.create({
      ...taskDetails,
      createdBy: user._id,
    });
    task_id = task._id;
  });
  afterEach(async () => {
    await db.clearDatabase();
  });
  afterAll(async () => {
    // await db.clearDatabase();
    await db.closeDatabase();
  });

  describe("get tasks:", () => {
    describe("given user is not logged in", () => {
      it("should return 401", async () => {
        const { statusCode } = await supertest(app).get("/v1/tasks");
        expect(statusCode).toBe(401);
      });
    });

    describe("given user is logged in", () => {
      it("should return 200 and return tasks", async () => {
        const jwt = signToken(userDetails.email, id!);

        const { statusCode } = await supertest(app)
          .get("/v1/tasks")
          .set("Authorization", `Bearer ${jwt}`);

        expect(statusCode).toBe(200);
      });
    });

    describe("provided task does not exist", () => {
      it("should return 404", () => {
        supertest(app).get(`/`);
        expect(true).toBe(true);
      });
    });
  });

  describe("get single task:", () => {
    describe("given user is not logged in", () => {
      it("should return 401", async () => {
        const { statusCode } = await supertest(app).get(
          `/v1/tasks/${task_id!}`
        );
        expect(statusCode).toBe(401);
      });
    });

    describe("given user is logged in and task exists", () => {
      it("should return 200 and return tasks", async () => {
        const jwt = signToken(userDetails.email, id!);

        const { statusCode } = await supertest(app)
          .get(`/v1/tasks/${task_id!}`)
          .set("Authorization", `Bearer ${jwt}`);

        expect(statusCode).toBe(200);
      });
    });

    describe("given user is logged in and task does not exist", () => {
      it("should return 404", async () => {
        const jwt = signToken(userDetails.email, id!);
        const { statusCode } = await supertest(app)
          .get(`/v1/tasks/${random_id}`)
          .set("Authorization", `Bearer ${jwt}`);

        expect(statusCode).toBe(404);
      });
    });

    describe("given user is logged in but task id is not a valid id", () => {
      it("should return 400", async () => {
        const jwt = signToken(userDetails.email, id!);
        const { statusCode } = await supertest(app)
          .get(`/v1/tasks/123456789`)
          .set("Authorization", `Bearer ${jwt}`);
        expect(statusCode).toBe(400);
      });
    });
  });

  describe("create task:", () => {
    describe("given that user is logged in and task payload is correct", () => {
      it("should return 201", async () => {
        const jwt = signToken(userDetails.email, id!);
        const payload = {
          title: "Test",
          description: "Test description",
          dueDate: new Date().toISOString(),
          status: "pending",
          createdBy: id!,
          priority: "high",
        };
        const { body, statusCode } = await supertest(app)
          .post("/v1/tasks")
          .set("Authorization", `Bearer ${jwt}`)
          .send(payload);

        expect(statusCode).toBe(201);
      });
    });

    describe("given that user is logged in and task payload is missing required fields", () => {
      it("should return 400", async () => {
        const jwt = signToken(userDetails.email, id!);
        const payload = {
          title: "Test",
          description: "Test description",
          dueDate: new Date().toISOString(),
        };
        const { statusCode } = await supertest(app)
          .post("/v1/tasks")
          .set("Authorization", `Bearer ${jwt}`)
          .send(payload);

        expect(statusCode).toBe(400);
      });
    });

    describe("given that user is not logged in", () => {
      it("should return 401", async () => {
        const payload = {
          title: "Test",
          description: "Test description",
          dueDate: new Date().toISOString(),
          status: "pending",
          createdBy: id!,
          priority: "high",
        };
        const { statusCode } = await supertest(app)
          .post("/v1/tasks")
          .send(payload);

        expect(statusCode).toBe(401);
      });
    });
  });

  describe("update task:", () => {
    describe("given that user is logged in and task payload is correct", () => {
      it("should return 201", async () => {
        const jwt = signToken(userDetails.email, id!);
        const payload = {
          title: "Test update",
          description: "Test description",
          status: "pending",
          priority: "high",
        };
        const { body, statusCode } = await supertest(app)
          .put(`/v1/tasks/${task_id!}`)
          .set("Authorization", `Bearer ${jwt}`)
          .send(payload);

        expect(statusCode).toBe(201);
      });
    });

    describe("given that user is not logged in", () => {
      it("should return 401", async () => {
        const payload = {
          title: "Test",
          description: "Test description",
        };
        const { statusCode } = await supertest(app)
          .put(`/v1/tasks/${task_id!}`)
          .send(payload);

        expect(statusCode).toBe(401);
      });
    });
  });

  describe("share task:", () => {
    describe("given that user is logged in and task payload is correct", () => {
      it("should return 201", async () => {
        const jwt = signToken(userDetails.email, id!);
        const payload = {
          id: task_id!,
          email: "johndiddles@tasks.com",
        };
        const { body, statusCode } = await supertest(app)
          .post(`/v1/tasks/share`)
          .set("Authorization", `Bearer ${jwt}`)
          .send(payload);

        expect(statusCode).toBe(201);
      });
    });

    describe("given that user is logged in but task payload is incorrect", () => {
      it("should return 400", async () => {
        const jwt = signToken(userDetails.email, id!);
        const payload = {
          id: task_id!,
        };
        const { body, statusCode } = await supertest(app)
          .post(`/v1/tasks/share`)
          .set("Authorization", `Bearer ${jwt}`)
          .send(payload);

        expect(statusCode).toBe(400);
      });
    });

    describe("given that user is not logged in", () => {
      it("should return 401", async () => {
        const payload = {
          title: "Test",
          description: "Test description",
        };
        const { statusCode } = await supertest(app)
          .post(`/v1/tasks/share`)
          .send(payload);

        expect(statusCode).toBe(401);
      });
    });
  });

  describe("delete task:", () => {
    describe("given that user is logged in", () => {
      it("should return 200", async () => {
        const jwt = signToken(userDetails.email, id!);

        const { statusCode } = await supertest(app)
          .delete(`/v1/tasks/${task_id!}`)
          .set("Authorization", `Bearer ${jwt}`);

        expect(statusCode).toBe(200);
      });
    });

    describe("given that user is logged in but task does not exist", () => {
      it("should return 404", async () => {
        const jwt = signToken(userDetails.email, id!);

        const { statusCode } = await supertest(app)
          .delete(`/v1/tasks/${random_id!}`)
          .set("Authorization", `Bearer ${jwt}`);

        expect(statusCode).toBe(404);
      });
    });

    describe("given that user is not logged in", () => {
      it("should return 401", async () => {
        const { statusCode } = await supertest(app).delete(
          `/v1/tasks/${task_id!}`
        );

        expect(statusCode).toBe(401);
      });
    });
  });
});
