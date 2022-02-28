import { createConnection } from "mongoose";
import { DB_URI } from "../../environmentVariables";

export const db = createConnection(DB_URI);
