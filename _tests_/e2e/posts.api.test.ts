import { app } from "../../src";
import request from "supertest";
import { randomUUID } from "crypto";

const productPayload = {
  title: "Bob",
  shortDescription: "Just regular Bob's blog",
  content: "Cool Bob's content",
};

describe("/posts", () => {
  beforeAll(async () => {
    await request(app).delete("/testing/all-data");
  });

  // GET
  it("should return 200 and an empty array", async () => {
    await request(app).get("/posts").expect(200, []);
  });

  // POST
  it("shouldn't create a new post when the user is not logged in ", async () => {
    await request(app).post("/posts").send(productPayload).expect(401);
  });

  it("shouldn't create a new post when the data is missing", async () => {
    await request(app)
      .post("/posts")
      .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
      .send(productPayload)
      .expect(400, {
        errorsMessages: [{ message: "Invalid value", field: "blogId" }],
      });
  });

  it("shouldn't create a new post when the data is incorrect", async () => {
    await request(app)
      .post("/posts")
      .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
      .send({
        ...productPayload,
        title: null,
        blogId: 123,
      })
      .expect(400, {
        errorsMessages: [
          { message: "Invalid value", field: "title" },
          { message: "Invalid value", field: "blogId" },
        ],
      });
  });

  let createdBlog: any = null;
  it("should create a new blog when the data is correct", async () => {
    const createdResponse = await request(app)
      .post("/blogs")
      .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
      .send({
        name: "Bob",
        description: "Just regular Bob's blog",
        websiteUrl: "https://it-incubator.io",
      })
      .expect(201);

    createdBlog = createdResponse.body;
    expect(createdBlog).toEqual({
      id: expect.any(String),
      name: "Bob",
      description: "Just regular Bob's blog",
      websiteUrl: "https://it-incubator.io",
      createdAt: expect.any(String),
    });
  });

  let createdPost: any = null;

  it("should create a new post when the data is correct", async () => {
    const createdResponse = await request(app)
      .post("/posts")
      .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
      .send({
        ...productPayload,
        blogId: createdBlog.id,
      })
      .expect(201);

    createdPost = createdResponse.body;
    expect(createdPost).toEqual({
      id: expect.any(String),
      ...productPayload,
      blogId: createdBlog.id,
      blogName: createdBlog.name,
      createdAt: expect.any(String),
    });
  });
});
