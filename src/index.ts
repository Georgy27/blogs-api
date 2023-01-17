import * as dotenv from "dotenv";
dotenv.config();
import { runDb } from "./repositories/db";
import { createServer } from "./utils/server";
// remove app to a different folder
const app = createServer();
const port = 3000;

const startApp = async () => {
  console.log(dotenv);
  console.log(process.env.PORT);
  console.log(process.env.MONGO_URL);
  await setTimeout(() => {
    console.log("timeout");
  }, 10000);
  await runDb();
  app.listen(port, () => {
    console.log(`App is listening on the port ${port}`);
  });
};

startApp();
