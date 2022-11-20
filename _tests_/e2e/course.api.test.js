"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const supertest_1 = __importDefault(require("supertest"));
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
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app).delete("/testing/all-data");
    }));
    // GET
    it("should return 200 and an empty array", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app).get("/blogs").expect(200, []);
    }));
    // GET:ID
    it("should return 404 if the blog doesnt exist", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app).get("/blogs/1").expect(404);
    }));
    // POST
    it("shouldn't create a new blog when the user is not logged in ", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app).post("/blogs").send(productPayload).expect(401);
    }));
    it("shouldn't create a new blog when the data is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .post("/blogs")
            .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
            .send({ name: "Bob", description: "Just regular Bob's Blog" })
            .expect(400, {
            errorsMessages: [{ message: "Invalid value", field: "websiteUrl" }],
        });
    }));
    it("shouldn't create a new blog when the data is incorrect", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
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
    }));
    let createdBlog = null;
    it("should create a new blog when the data is correct", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdResponse = yield (0, supertest_1.default)(src_1.app)
            .post("/blogs")
            .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
            .send(productPayload)
            .expect(201);
        createdBlog = createdResponse.body;
        expect(createdBlog).toEqual(Object.assign({ id: expect.any(String) }, productPayload));
    }));
    // PUT
    it("shouldn't update a blog when the data is incorrect", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .put(`/blogs/${createdBlog.id}`)
            .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
            .send(Object.assign(Object.assign({}, productPayload), { name: null }))
            .expect(400, {
            errorsMessages: [{ message: "Invalid value", field: "name" }],
        });
        yield (0, supertest_1.default)(src_1.app).get(`/blogs/${createdBlog.id}`).expect(200, createdBlog);
    }));
    it("shouldn't update the course when the id is incorrect", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .put("/blogs/1")
            .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
            .send(productPayload)
            .expect(404);
    }));
    it("shouldn't update the course when the user is not authorized", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .put(`/blogs/${createdBlog.id}`)
            .set("Authorization", `Bearer YWRtaW46cXdlcnR5`)
            .send(productPayload)
            .expect(401);
    }));
    it("should update the course when the input data is correct", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .put(`/blogs/${createdBlog.id}`)
            .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
            .send(Object.assign(Object.assign({}, productPayload), { name: "George" }))
            .expect(204);
    }));
    // DELETE
    it("should delete the course when the input data is correct", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .delete(`/blogs/${createdBlog.id}`)
            .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
            .expect(204);
        yield (0, supertest_1.default)(src_1.app).get(`/blogs/${createdBlog.id}`).expect(404);
        yield (0, supertest_1.default)(src_1.app).get("/blogs").expect(200, []);
    }));
});
