import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import users from "../data/users.js";
import posts from "../data/posts.js";

const db = await dbConnection();
await db.dropDatabase();
//seed data here
console.log("Done seeding database");
await closeConnection();
