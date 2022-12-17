import request from "supertest";
import { createServer } from "../../src/utils/server";
import { constants } from "./constants";
import { BlogsDBModel } from "../../src/models/blogs-model/BlogsDBModel";
const app = createServer();

const blogsPayload = {
  name: "Bob",
  description: "Just regular Bob's blog",
  websiteUrl: "https://it-incubator.io",
};

describe("blog router", () => {
  beforeAll(async () => {
    const { statusCode, body } = await request(app).delete("/testing/all-data");
    expect(statusCode).toBe(204);
    expect(body).toEqual({});
  });
  describe("GET METHODS", () => {
    describe("Get all blogs /blogs (GET)", () => {
      it("should return 200 and an empty array", async () => {
        await request(app).get("/blogs").expect(200, {
          pagesCount: 0,
          page: 1,
          pageSize: 10,
          totalCount: 0,
          items: [],
        });
      });
    });
    describe("Get blog /blogs/:id (GET)", () => {
      it("should return 404 if the blog doesnt exist", async () => {
        await request(app).get("/blogs/1").expect(404);
      });
    });
    describe("Get all posts for specified blogID /blogs/:blogId/posts", () => {
      it("create blog and posts as prepared data", async () => {
        // create blog
        const blog1 = await request(app)
          .post("/blogs")
          .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
          .send(constants.createBlog1);
        // create few posts for this blogId
        const post1 = await request(app)
          .post(`/blogs/${blog1.body.id}/posts`)
          .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
          .send(constants.createPost1);
        const post2 = await request(app)
          .post(`/blogs/${blog1.body.id}/posts`)
          .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
          .send(constants.createPost2);

        expect.setState({ blog1, post1, post2 });
      });
      it("should return all the posts for blogId", async () => {
        const { blog1, post1, post2 } = expect.getState();
        const { statusCode, body } = await request(app).get(
          `/blogs/${blog1.body.id}/posts`
        );
        expect(statusCode).toBe(200);
        expect(body.items.length).toBe(2);
        expect(body.totalCount).toBe(2);
        expect(body).toStrictEqual({
          pagesCount: 1,
          page: 1,
          pageSize: 10,
          totalCount: 2,
          items: expect.arrayContaining([
            {
              id: expect.any(String),
              title: post1.body.title,
              shortDescription: post1.body.shortDescription,
              content: post1.body.content,
              blogId: blog1.body.id,
              blogName: blog1.body.name,
              createdAt: expect.any(String),
            },
            {
              id: expect.any(String),
              title: post2.body.title,
              shortDescription: post2.body.shortDescription,
              content: post2.body.content,
              blogId: blog1.body.id,
              blogName: blog1.body.name,
              createdAt: expect.any(String),
            },
          ]),
        });
      });
    });
  });
  describe("POST METHODS", () => {
    const generateString = (len: number) => {
      let str = "";
      let i = 0;
      while (i < len) {
        str += "1";
        i++;
      }
      return str;
    };

    describe("check input validation", () => {
      const errors = {
        errorsMessages: [
          { message: expect.any(String), field: "name" },
          { message: expect.any(String), field: "description" },
          { message: expect.any(String), field: "websiteUrl" },
        ],
      };

      it("should return 400 status code and array of error because data the data was not sent", async () => {
        const { statusCode, body } = await request(app)
          .post("/blogs")
          .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
          .send({});

        expect(statusCode).toBe(400);
        expect(body).toEqual(errors);
      });

      it("should return 400 status code and array of error because data the data is invalid", async () => {
        const { statusCode, body } = await request(app)
          .post("/blogs")
          .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
          .send({ name: "", description: "", websiteUrl: "" });

        expect(statusCode).toBe(400);
        expect(body).toEqual(errors);
      });
      it("should return 400 status code and array of error because data the data is invalid", async () => {
        const { statusCode, body } = await request(app)
          .post("/blogs")
          .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
          .send({
            name: "                            ",
            description: 23,
            websiteUrl: undefined,
          });

        expect(statusCode).toBe(400);
        expect(body).toEqual(errors);
      });
      it("should return 400 status code and array of error because data the data exceeds the length requirement", async () => {
        const { statusCode, body } = await request(app)
          .post("/blogs")
          .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
          .send({
            name: generateString(16),
            description: generateString(501),
            websiteUrl: generateString(1001),
          });

        expect(statusCode).toBe(400);
        expect(body).toEqual(errors);
      });
    });

    describe("check authorization", () => {
      it("shouldn't create a new blog when the user is not logged in ", async () => {
        await request(app)
          .post("/blogs")
          .send(constants.createBlog1)
          .expect(401);
      });
    });

    describe("Create blog /blogs (BLOG)", () => {
      it("should create a new blog when the data is correct", async () => {
        const blog1 = await request(app)
          .post("/blogs")
          .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
          .send(constants.createBlog1)
          .expect(201);
        constants.variables.setBlogId = blog1.body.id;
        expect(blog1.body).toEqual({
          id: expect.any(String),
          ...constants.createBlog1,
          createdAt: expect.any(String),
        });
      });
    });
  });

  // PUT
  it("shouldn't update a blog when the data is incorrect", async () => {
    await request(app)
      .put(`/blogs/${constants.variables.setBlogId}`)
      .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
      .send({ ...constants.createBlog1, name: null })
      .expect(400, {
        errorsMessages: [{ message: "Invalid value", field: "name" }],
      });
  });

  it("shouldn't update the course when the id is incorrect", async () => {
    await request(app)
      .put(`/blogs/${constants.variables.setBlogId3}`)
      .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
      .send(constants.createBlog1)
      .expect(404);
  });

  it("shouldn't update the course when the user is not authorized", async () => {
    await request(app)
      .put(`/blogs/${constants.variables.setBlogId}`)
      .set("Authorization", `Bearer YWRtaW46cXdlcnR5`)
      .send(constants.createBlog1)
      .expect(401);

    // checking if the blog with this id exists
    const { statusCode, body } = await request(app).get(
      `/blogs/${constants.variables.setBlogId}`
    );
    expect(statusCode).toBe(200);
    expect(body).toEqual({
      id: expect.any(String),
      ...constants.createBlog1,
      createdAt: expect.any(String),
    });
  });

  it("should update the course when the input data is correct", async () => {
    await request(app)
      .put(`/blogs/${constants.variables.setBlogId}`)
      .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
      .send({ ...constants.createBlog1, name: "George" })
      .expect(204);
  });

  // DELETE

  it("should delete the course when the input data is correct", async () => {
    await request(app)
      .delete(`/blogs/${constants.variables.setBlogId}`)
      .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
      .expect(204);

    await request(app)
      .get(`/blogs/${constants.variables.setBlogId}`)
      .expect(404);

    const { statusCode, body } = await request(app).get("/blogs");
    expect(statusCode).toBe(200);
    expect(body).toStrictEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [
        {
          id: expect.any(String),
          name: "blogTest1",
          description: "blogTest1 description",
          websiteUrl: "https://blogTest1.com",
          createdAt: expect.any(String),
        },
      ],
    });
  });
});
