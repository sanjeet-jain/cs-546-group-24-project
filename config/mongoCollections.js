import { dbConnection } from "./mongoConnection.js";

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

// NOTE: YOU WILL NEED TO CHANGE THE CODE BELOW TO HAVE THE COLLECTION(S) REQUIRED BY THE ASSIGNMENT
export const tasks = getCollectionFn("tasks");
export const reminders = getCollectionFn("reminders");
export const notes = getCollectionFn("notes");
export const meetings = getCollectionFn("meetings");
export const displayProps = getCollectionFn("displayProps");
export const userCollection = getCollectionFn("user");
