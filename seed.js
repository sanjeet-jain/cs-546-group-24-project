// seed file for all the collections
import * as mongoCollections from "./config/mongoCollections.js";
import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import ObjectId from "mongodb";
export async function runSetup() {}

export async function seed() {
  const db = await dbConnection();
  await db.dropDatabase();
  await runSetup();
  await closeConnection();
}
