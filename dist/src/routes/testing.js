"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const composition_root_1 = require("../composition-root");
const TestController_1 = require("../controllers/TestController");
exports.testingRouter = (0, express_1.Router)({});
const testController = composition_root_1.container.resolve(TestController_1.TestController);
exports.testingRouter.delete("/", testController.dropDatabase.bind(testController));
