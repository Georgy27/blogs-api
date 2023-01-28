import { Router } from "express";
import { container } from "../composition-root";
import { TestController } from "../controllers/TestController";

export const testingRouter = Router({});
const testController = container.resolve(TestController);
testingRouter.delete("/", testController.dropDatabase.bind(testController));
