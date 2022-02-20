import { app } from "./start";
import { PORT } from "./utils/app.util";

/**
 * Server Activation
 */
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
