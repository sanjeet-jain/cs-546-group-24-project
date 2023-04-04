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

export const usersCollection = getCollectionFn("users");
export const meetingsCollection = getCollectionFn("meetings");
export const notesCollection = getCollectionFn("notes");
export const tasksCollection = getCollectionFn("tasks");
export const remindersCollection = getCollectionFn("reminders");
