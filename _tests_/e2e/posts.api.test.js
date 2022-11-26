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
    title: "Bob",
    shortDescription: "Just regular Bob's blog",
    content: "Cool Bob's content",
};
describe("/posts", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app).delete("/testing/all-data");
    }));
    // GET
    it("should return 200 and an empty array", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app).get("/posts").expect(200, []);
    }));
    // POST
    it("shouldn't create a new post when the user is not logged in ", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app).post("/posts").send(productPayload).expect(401);
    }));
    it("shouldn't create a new post when the data is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .post("/posts")
            .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
            .send(productPayload)
            .expect(400, {
            errorsMessages: [{ message: "Invalid value", field: "blogId" }],
        });
    }));
    it("shouldn't create a new post when the data is incorrect", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .post("/posts")
            .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
            .send(Object.assign(Object.assign({}, productPayload), { title: null, blogId: 123 }))
            .expect(400, {
            errorsMessages: [
                { message: "Invalid value", field: "title" },
                { message: "Invalid value", field: "blogId" },
            ],
        });
    }));
    let createdBlog = null;
    it("should create a new blog when the data is correct", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdResponse = yield (0, supertest_1.default)(src_1.app)
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
    }));
    let createdPost = null;
    it("should create a new post when the data is correct", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdResponse = yield (0, supertest_1.default)(src_1.app)
            .post("/posts")
            .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
            .send(Object.assign(Object.assign({}, productPayload), { blogId: createdBlog.id }))
            .expect(201);
        createdPost = createdResponse.body;
        expect(createdPost).toEqual(Object.assign(Object.assign({ id: expect.any(String) }, productPayload), { blogId: createdBlog.id, blogName: createdBlog.name, createdAt: expect.any(String) }));
    }));
});
