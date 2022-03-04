import { connectToDb } from "./db/connection";
import { app } from "./start";
import 'dotenv/config'

/**
 * Server Activation
 */
connectToDb().then(() => {
  app.listen(<string>process.env.PORT, () => {
    console.log(`listening on port ${<string>process.env.PORT}`);
  });
});
