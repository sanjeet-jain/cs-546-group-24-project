/*
Note Collection {
_id: ObjectId,
title: String,
dateCreated: DateTimeStamp,
dateAddedTo: DateTimeStamp
textBody: String,
tag: String,
documentLink: [String]
type: “notes”
}

*/
import utils from "../utils/utils.js";
import { ObjectId } from "mongodb";
import { notesCollection } from "../config/mongoCollections.js";
import { usersCollection } from "../config/mongoCollections.js";
import constants from "../constants/constants.js";

const exportedMethods = {
  async get(noteId) {
    utils.checkObjectIdString(noteId);

    const notes = await notesCollection();
    const note = await notes.findOne({ _id: new ObjectId(noteId) });

    // if the note exists in collection then return it else throw an error
    if (note) {
      return note;
    } else {
      throw new Error("note not found");
    }
  },
  async getAll(userId) {
    utils.checkObjectIdString(userId);

    const users = await usersCollection();
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (user) {
      const noteIdList = user.noteIds;
      const notes = await notesCollection();
      const notesList = await notes
        .find({ _id: { $in: noteIdList } })
        .toArray();
      return notesList;
    } else {
      throw new Error("user not found");
    }
  },
  async create(
    userId,
    title,
    // dateCreated,
    dateAddedTo,
    textBody,
    tag,
    documentLinks // how to use this ???????
    // type
  ) {
    utils.checkObjectIdString(userId);
    utils.validateNotesInputs(
      title,
      dateAddedTo,
      textBody,
      tag,
      documentLinks // how to use this ???????
    );

    title = title.trim();
    dateAddedTo = dateAddedTo.trim();
    tag = tag.trim();

    const users = await usersCollection();
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw new Error("User not found.");
    }
    let dateCreated = new Date().toString();
    const notes = await notesCollection();
    const result = await notes.insertOne({
      title: title,
      dateCreated: dateCreated,
      dateAddedTo: dateAddedTo,
      textBody: textBody,
      tag: tag,
      documentLink: [],
      type: "notes",
    });
    const insertedId = result.insertedId;
    await users.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { noteIds: insertedId } }
    );
    return this.get(insertedId.toString());
  },
  async update(
    // userId,
    noteId,
    title,
    dateAddedTo,
    textBody,
    tag,
    documentLinks // how to use this ???????
  ) {
    utils.checkObjectIdString(noteId);
    // utils.checkObjectIdString(userId);
    utils.validateNotesInputs(
      title,
      dateAddedTo,
      textBody,
      tag,
      documentLinks // how to use this ???????
    );

    const notes = await notesCollection();
    const note = await this.get(noteId.trim());
    let updatednote = {};
    // updatednote.userId = userId.trim();
    updatednote._id = noteId.trim();
    updatednote.title = title.trim();
    updatednote.dateAddedTo = dateAddedTo.trim();
    updatednote.textBody = textBody.trim();
    updatednote.tag = tag.trim().toLowerCase();
    updatednote.documentLinks = documentLinks;
    updatednote.dateCreated = note.dateCreated;
    updatednote.type = "notes";

    const result = await notes.updateOne(
      { _id: new ObjectId(noteId) },
      { $set: updatednote }
    );
    if (
      result.modifiedCount === 1 &&
      result.matchedCount == 1 &&
      result.acknowledged === true
    ) {
      const updatednote = await notes.findOne({
        _id: new ObjectId(noteId),
      });
      return updatednote;
    } else {
      if (result.matchedCount !== 1) throw new Error("note not found");
      if (result.modifiedCount !== 1)
        throw new Error("note Details havent Changed");
      if (result.acknowledged !== true)
        throw new Error("note update wasnt successfull");
    }
  },
  async delete(noteId, userId) {
    utils.checkObjectIdString(noteId);

    const notes = await notesCollection();
    const deletionInfo = await notes.findOneAndDelete({
      _id: new ObjectId(noteId),
    });
    if (deletionInfo.lastErrorObject.n === 0) {
      throw new Error(`${noteId} not found for deletion`);
    }
    const users = await usersCollection();
    //update the userCollection by removing the same id from the noteIds array in user collection
    await users.updateOne(
      { noteIds: new ObjectId(noteId) },
      { $pull: { noteIds: new ObjectId(noteId) } }
    );

    // if the note exists in collection then return it else throw an error
    return `${deletionInfo.value._id} has been successfully deleted!`;
  },
};

export default exportedMethods;
