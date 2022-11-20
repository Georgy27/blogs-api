import { app } from "../../src";
import request from "supertest";

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
});
