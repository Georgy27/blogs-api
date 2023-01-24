"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const composition_root_1 = require("../composition-root");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter.delete("/", composition_root_1.testController.dropDatabase.bind(composition_root_1.testController));
