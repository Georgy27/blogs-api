import { app } from "../../src";
import request from "supertest";

const productPayload = {
  name: "Bob",
  description: "Just regular Bob's blog",
  websiteUrl: "https://it-incubator.io",
};
const userPayload = {
  username: "admin",
  password: "qwerty",
};

describe("/blogs", () => {
  beforeAll(async () => {
    await request(app).delete("/testing/all-data");
  });

  // GET
  it("should return 200 and an empty array", async () => {
    await request(app).get("/blogs").expect(200, []);
  });
  // GET:ID
  it("should return 404 if the blog doesnt exist", async () => {
    await request(app).get("/blogs/1").expect(404);
  });

  // POST
  it("shouldn't create a new blog when the user is not logged in ", async () => {
    await request(app).post("/blogs").send(productPayload).expect(401);
  });

  it("shouldn't create a new blog when the data is missing", async () => {
    await request(app)
      .post("/blogs")
      .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
      .send({ name: "Bob", description: "Just regular Bob's Blog" })
      .expect(400, {
        errorsMessages: [{ message: "Invalid value", field: "websiteUrl" }],
      });
  });

  it("shouldn't create a new blog when the data is incorrect", async () => {
    await request(app)
      .post("/blogs")
      .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
      .send({
        name: null,
        description: "",
        websiteUrl: "https://it-incubator.io",
      })
      .expect(400, {
        errorsMessages: [
          { message: "Invalid value", field: "name" },
          { message: "Invalid value", field: "description" },
        ],
      });
  });
  let createdBlog: any = null;
  it("should create a new blog when the data is correct", async () => {
    const createdResponse = await request(app)
      .post("/blogs")
      .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
      .send(productPayload)
      .expect(201);

    createdBlog = createdResponse.body;
    expect(createdBlog).toEqual({
      id: expect.any(String),
      ...productPayload,
    });
  });

  // PUT

  it("shouldn't update a blog when the data is incorrect", async () => {
    await request(app)
      .put(`/blogs/${createdBlog.id}`)
      .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
      .send({ ...productPayload, name: null })
      .expect(400, {
        errorsMessages: [{ message: "Invalid value", field: "name" }],
      });

    await request(app).get(`/blogs/${createdBlog.id}`).expect(200, createdBlog);
  });

  it("shouldn't update the course when the id is incorrect", async () => {
    await request(app)
      .put("/blogs/1")
      .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
      .send(productPayload)
      .expect(404);
  });

  it("shouldn't update the course when the user is not authorized", async () => {
    await request(app)
      .put(`/blogs/${createdBlog.id}`)
      .set("Authorization", `Bearer YWRtaW46cXdlcnR5`)
      .send(productPayload)
      .expect(401);
  });

  it("should update the course when the input data is correct", async () => {
    await request(app)
      .put(`/blogs/${createdBlog.id}`)
      .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
      .send({ ...productPayload, name: "George" })
      .expect(204);
  });

  // DELETE

  it("should delete the course when the input data is correct", async () => {
    await request(app)
      .delete(`/blogs/${createdBlog.id}`)
      .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
      .expect(204);

    await request(app).get(`/blogs/${createdBlog.id}`).expect(404);

    await request(app).get("/blogs").expect(200, []);
  });
});
