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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
class TestController {
    constructor(blogsRepository, postsRepository, usersRepository, commentsRepository, reactionsRepository) {
        this.blogsRepository = blogsRepository;
        this.postsRepository = postsRepository;
        this.usersRepository = usersRepository;
        this.commentsRepository = commentsRepository;
        this.reactionsRepository = reactionsRepository;
    }
    dropDatabase(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.blogsRepository.clearBlogs();
            yield this.postsRepository.clearPosts();
            yield this.usersRepository.clearUsers();
            yield this.commentsRepository.clearComments();
            yield this.reactionsRepository.clearReactions();
            return res.sendStatus(204);
        });
    }
}
exports.TestController = TestController;
