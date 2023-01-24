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
exports.UsersController = void 0;
class UsersController {
    constructor(usersService, usersQueryRepository) {
        this.usersService = usersService;
        this.usersQueryRepository = usersQueryRepository;
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("im in controller");
            const { login, password, email } = req.body;
            const newUser = yield this.usersService.createUserByAdmin(login, password, email);
            return res.status(201).send(newUser);
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { searchLoginTerm, searchEmailTerm, sortBy, sortDirection } = req.query;
            const { pageSize, pageNumber } = req.query;
            const allUsers = yield this.usersQueryRepository.findUsers(pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm);
            res.status(200).send(allUsers);
        });
    }
    deleteUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const getDeletedUser = yield this.usersService.deleteUser(userId);
            if (!getDeletedUser) {
                return res.sendStatus(404);
            }
            return res.sendStatus(204);
        });
    }
}
exports.UsersController = UsersController;
