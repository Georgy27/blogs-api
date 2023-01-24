import { Router } from "express";
import {
  refreshTokenMiddleware,
  securityDeviceController,
} from "../composition-root";
export const securityDevicesRouter = Router({});

const refreshTokenMw = refreshTokenMiddleware.use.bind(refreshTokenMiddleware);
securityDevicesRouter.get(
  "/",
  refreshTokenMw,
  securityDeviceController.getAllDevicesWithActiveSession.bind(
    securityDeviceController
  )
);
securityDevicesRouter.delete(
  "/",
  refreshTokenMw,
  securityDeviceController.deleteAllDevicesSessionsButActive.bind(
    securityDeviceController
  )
);
securityDevicesRouter.delete(
  "/:deviceId",
  refreshTokenMw,
  securityDeviceController.deleteDeviceSessionById.bind(
    securityDeviceController
  )
);
