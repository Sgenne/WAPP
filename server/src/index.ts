import { connectToDb } from "./db/connection";
import { app } from "./start";
import { PORT } from "./utils/app.util";

/**
 * Server Activation
 */
connectToDb().then(() => {
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
});
