import { runDb } from "./repositories/db";
import { createServer } from "./utils/server";
// remove app to a different folder
const app = createServer();
const port = 3000;

const startApp = async () => {
  await runDb();
  app.listen(port, () => {
    console.log(`App is listening on the port ${port}`);
  });
};

startApp();
