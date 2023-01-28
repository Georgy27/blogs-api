import { Router } from "express";
import { container } from "../composition-root";
import { SecurityDevicesController } from "../controllers/SecurityDevicesController";
import { RefreshTokenMiddleware } from "../middlewares/auth/refresh-token-middleware";
export const securityDevicesRouter = Router({});

const securityDevicesController = container.resolve(SecurityDevicesController);
const refreshTokenMw = container.resolve(RefreshTokenMiddleware);

securityDevicesRouter.get(
  "/",
  refreshTokenMw.use.bind(refreshTokenMw),
  securityDevicesController.getAllDevicesWithActiveSession.bind(
    securityDevicesController
  )
);
securityDevicesRouter.delete(
  "/",
  refreshTokenMw.use.bind(refreshTokenMw),
  securityDevicesController.deleteAllDevicesSessionsButActive.bind(
    securityDevicesController
  )
);
securityDevicesRouter.delete(
  "/:deviceId",
  refreshTokenMw.use.bind(refreshTokenMw),
  securityDevicesController.deleteDeviceSessionById.bind(
    securityDevicesController
  )
);
