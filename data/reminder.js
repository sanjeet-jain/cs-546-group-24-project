import utils from "../utils/utils.js";
import { ObjectId } from "mongodb";
import {
  usersCollection,
  remindersCollection,
} from "./../config/mongoCollections.js";

import constants from "./../constants/constants.js";

/** API Reminder.js */
export const createReminder = async (
  user_id,
  title,
  textBody,
  priority,
  tag,
  repeating,
  endDateTime,
  repeatingCounterIncrement,
  repeatingIncrementBy,
  dateTimeAddedTo
) => {
  utils.checkObjectIdString(user_id);
  user_id = user_id.trim();
  utils.validateStringInput(title, "title", constants.stringLimits["title"]);
  title = title.trim();
  utils.validateStringInput(
    textBody,
    "text body",
    constants.stringLimits["textBody"]
  );
  textBody = textBody.trim();
  utils.validatePriority(priority, "priority");
  /**
   * Tags should be case insensitive and all tags should be converted to lowercase
   */
  utils.validateStringInput(tag, "tag", constants.stringLimits["tag"]);
  tag = tag.trim().toLowerCase();
  let dateCreated = new Date();
  utils.validateDateObj(dateTimeAddedTo,"date time value");
  utils.validateBooleanInput(repeating);
  if (repeating) {
    utils.validateDateObj(endDateTime,"end date value");
    utils.validateRepeatingIncrementBy(repeatingIncrementBy);
  } else {
    endDateTime = null;
    repeatingIncrementBy = null;
  }
  /**
   * Check if two reminder titles be same or not meaning user passes same title tag and due date it ideally is a duplicate date
   */
  let reminderEvents = await getAllReminderEventsDAO(user_id);
  for (let i = 0; i < reminderEvents.length; i++) {
    if (endDateTime === null) {
      if (
        utils.isDateObjOverllaping(
          dateTimeAddedTo,
          dateTimeAddedTo,
          reminderEvents.dateTimeAddedTo
        ) &&
        title.toLowerCase() === reminderEvents[i].title.toLowerCase() &&
        tag === reminderEvents[i].tag
      ) {
        throw `Error : No Two reminders can have same title tag and time`;
      }
    } else {
      if (
        utils.isDateObjOverllaping(
          dateTimeAddedTo,
          endDateTime,
          reminderEvents.dateTimeAddedTo
        ) &&
        title.toLowerCase() === reminderEvents[i].title.toLowerCase() &&
        tag === reminderEvents[i].tag
      ) {
        throw `Error : No Two reminders can have same title tag and time`;
      }
    }
  }
  const reminder = {
    title: title,
    textBody: textBody,
    priority: priority,
    tag: tag,
    repeating: repeating,
    endDateTime: endDateTime /** TODO Add counter later */,
    repeatingIncrementBy: repeatingIncrementBy,
    expired: false,
    dateTimeAddedTo: dateTimeAddedTo,
    dateCreated: dateCreated,
    type: "reminder",
  };
  if (!repeating) {
    reminder.groupId = null;
    let reminder_id = await insertReminderEventDAO(reminder);
    await insertReminderIdToUserCollectionDAO(user_id, reminder_id);
  } else {
    const listOfEvents = duplicateReminderEvents(reminder);
    const reminderIdObj = await addAllReminderEventDAO(listOfEvents);
    let reminderIdsList = [];
    let keySets = Object(reminderIdObj);
    for (let i = 0; i < keySets.length; i++) {
      reminderIdsList.push(reminderIdObj[keySets[i]]);
    }
    await addAllReminderIdsDAO(user_id, reminderIdsList); ///Add User
  }
  return true;
};

export const getReminder = async (reminder_id) => {
  utils.checkObjectIdString(reminder_id);
  reminder_id = reminder_id.trim();
  return await getSingleReminderEventDAO(reminder_id);
};

export const getAllReminders = async (user_id) => {
  utils.checkObjectIdString(user_id);
  user_id = user_id.trim();
  let reminderEvents = await getAllReminderEventsDAO(user_id);
  return reminderEvents;
};

export const updateReminder = async (
  user_id,
  reminder_id,
  title,
  textBody,
  priority,
  tag,
  dateTimeAddedTo,
  repeating,
  endDateTime,
  repeatingCounterIncrement,
  repeatingIncrementBy,
  flagForUpdateSingleReminderUpdate
) => {
  utils.checkObjectIdString(reminder_id);
  reminder_id = reminder_id.trim();
  utils.validateStringInput(title, "title", constants.stringLimits["title"]);
  title = title.trim();
  utils.validateStringInput(
    textBody,
    "text body",
    constants.stringLimits["textBody"]
  );
  textBody = textBody.trim();
  utils.validatePriority(priority, "priority");
  /**
   * Tags should be case insensitive and all tags should be converted to lowercase
   */
  utils.validateStringInput(tag, "tag", constants.stringLimits["tag"]);
  tag = tag.trim().toLowerCase();
  let dateCreated = new Date();
  utils.validateDateObj(dateTimeAddedTo,"date time value");
  utils.validateBooleanInput(repeating);
  if (!flagForUpdateSingleReminderUpdate) {
    utils.validateDateObj(endDateTime,"end time value");
    utils.validateRepeatingIncrementBy(repeatingIncrementBy);
  } else {
    //repeatCounter = 0;
    repeatingIncrementBy = null;
  }
  let reminder = await getReminder(reminder_id);
  const reminderObj = {
    title: title,
    textBody: textBody,
    priority: priority,
    tag: tag,
    dateCreated: dateCreated,
    dateTimeAddedTo: dateTimeAddedTo,
    repeating: repeating,
    endDateTime: endDateTime,
    repeatingIncrementBy: repeatingIncrementBy,
  };
  /**
   * This code causes update for single recurrence and normal update
   */
  if (
    (!repeating && !reminder.repeating && flagForUpdateSingleReminderUpdate) ||
    (!repeating && reminder.repeating && flagForUpdateSingleReminderUpdate)
  ) {
    reminderObj.repeating = false;
    reminderObj.endDateTime = null;
    reminderObj.repeatingIncrementBy = null;
    reminderObj.groupId = null;
    await updateReminderByReminderIdDAO(reminder_id, reminderObj);
  } else {
    /**
     * If DateTime is same them you just have to update rest of records no new reminder needs to be created
     */
    if (
      utils.isDateEqual(reminder.dateTimeAddedTo, dateTimeAddedTo) &&
      utils.isDateEqual(reminder.endDateTime, endDateTime)
    ) {
      await updateAllRecurrencesDAO(user_id, reminder_id, reminderObj);
    } else {
      await deleteAllRecurrences(user_id, reminder_id);
      await createReminder(
        user_id,
        title,
        textBody,
        priority,
        tag,
        repeating,
        endDateTime,
        repeatingCounterIncrement,
        repeatingIncrementBy,
        dateTimeAddedTo
      );
    }
  }
};

export const deleteReminder = async (user_id, reminder_id, flag) => {
  utils.checkObjectIdString(user_id);
  user_id = user_id.trim();
  utils.checkObjectIdString(reminder_id);
  reminder_id = reminder_id.trim();
  utils.validateBooleanInput(flag);
  if (flag) {
    await deleteReminderEventDAO(reminder_id);
    await deleteReminderFromUserCollectionDAO(user_id, reminder_id);
  } else {
    await deleteAllRecurrences(user_id, reminder_id);
  }
};

const updateAllRecurrencesDAO = async (user_id, reminder_id, reminder) => {
  const reminderInstance = await remindersCollection();
  let user = await getUserDAO(user_id);
  let reminderEvent = await getReminder(reminder_id);
  const result = await reminderInstance.updateMany(
    {
      _id: { $in: user.reminderIds },
      groupId: reminderEvent.groupId,
      expired: false,
    },
    {
      $set: {
        title: reminder.title,
        textBody: reminder.textBody,
        priority: reminder.priority,
        tag: reminder.tag,
      },
    }
  );
  if (
    !(
      result.modifiedCount > 0 &&
      result.matchedCount > 0 &&
      result.acknowledged === true
    )
  ) {
    if (result.matchedCount == 0) throw new Error("Meetings not found");
    if (result.modifiedCount == 0)
      throw new Error("Meetings Details havent Changed");
    if (result.acknowledged !== true)
      throw new Error("Meetings update wasnt successfull");
  }
};

const deleteAllRecurrences = async (user_id, reminder_id) => {
  utils.checkObjectIdString(user_id);
  user_id = user_id.trim();
  utils.checkObjectIdString(reminder_id);
  reminder_id = reminder_id.trim();
  const reminderEvent = await getReminder(reminder_id);
  const listOfReminderEvents = await getReminderEventsByGroupDAO(
    reminderEvent.groupId
  );
  const listOfIds = [];
  for (let i = 0; i < listOfReminderEvents.length; i++) {
    listOfIds.push(listOfReminderEvents[i]._id);
  }
  await deleteAllReminderEventsDAO(reminderEvent.groupId, listOfIds);
  await deleteListedIdsFromUserDAO(user_id, listOfIds);
};

/** API Reminder.js  END*/

/** Supporting Functions  Start */

function duplicateReminderEvents(reminder) {
  let listOfEvents = [];
  let currentDate = reminder.dateTimeAddedTo;
  let endDateTime = reminder.endDateTime;
  reminder.groupId = new ObjectId();
  while (endDateTime - currentDate >= 0) {
    reminder.dateTimeAddedTo = currentDate;
    listOfEvents.push(constructNewReminderObj(reminder));
    if (reminder.repeatingIncrementBy === "day") {
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    } else if (reminder.repeatingIncrementBy === "week") {
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 7));
    } else if (reminder.repeatingIncrementBy === "month") {
      currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    } else if (reminder.repeatingIncrementBy === "year") {
      currentDate = new Date(
        currentDate.setDate(currentDate.getFullYear() + 1)
      );
    }
  }
  return listOfEvents;
}

function constructNewReminderObj(reminderEvent) {
  const reminderObj = {
    title: reminderEvent.title,
    textBody: reminderEvent.textBody,
    priority: reminderEvent.priority,
    tag: reminderEvent.tag,
    dateCreated: reminderEvent.dateCreated,
    dateTimeAddedTo: new Date(reminderEvent.dateTimeAddedTo.valueOf()),
    repeating: reminderEvent.repeating,
    endDateTime: new Date(reminderEvent.endDateTime.valueOf()),
    repeatingIncrementBy: reminderEvent.repeatingIncrementBy,
    expired: reminderEvent.expired,
    groupId: reminderEvent.groupId,
  };
  return reminderObj;
}
/** Supporting Functions End */

/**   DAO Layer Start  */

const deleteAllReminderEventsDAO = async (groupId, reminderIdList) => {
  const reminderInstance = await remindersCollection();
  const result = await reminderInstance.deleteMany({
    _id: { $in: reminderIdList },
    groupId: groupId,
  });
};

const deleteListedIdsFromUserDAO = async (user_id, listOfIds) => {
  const userInstance = await usersCollection();
  const result = await userInstance.updateMany(
    { _id: new ObjectId(user_id) },
    { $pull: { reminderIds: { $in: listOfIds } } }
  );
  if (
    !(
      result.modifiedCount > 0 &&
      result.matchedCount > 0 &&
      result.acknowledged === true
    )
  ) {
    if (result.matchedCount == 0) throw new Error("Meetings not found");
    if (result.modifiedCount == 0)
      throw new Error("Meetings Details havent Changed");
    if (result.acknowledged !== true)
      throw new Error("Meetings update wasnt successfull");
  }
};

const addAllReminderIdsDAO = async (user_id, listOfReminderIds) => {
  const usersInstance = await usersCollection();
  const insertInfo = await usersInstance.updateOne(
    { _id: new ObjectId(user_id) },
    { $push: { reminderIds: { $each: listOfReminderIds } } }
  );
  if (insertInfo.modifiedCount === 0) {
    throw `Error : ids were not successfully updated to the user collection`;
  }
};

const addAllReminderEventDAO = async (listOfReminderEvents) => {
  const reminderInstance = await remindersCollection();
  const insertInfo = await reminderInstance.insertMany(listOfReminderEvents);
  if (
    insertInfo.insertIds === null ||
    insertInfo.insertedCount !== listOfReminderEvents.length
  ) {
    throw `Error : list of reminder events was not successfully added to db`;
  }
  return insertInfo.insertedIds;
};

const deleteReminderFromUserCollectionDAO = async (user_id, reminder_id) => {
  const userInstance = await usersCollection();
  let obj = await userInstance.updateOne(
    { _id: new ObjectId(user_id) },
    {
      $pull: { reminderIds: new ObjectId(reminder_id) },
    }
  );
  if (obj === null) {
    throw `Error : while updating the document`;
  } else if (!(obj.modifiedCount === 1)) {
    throw `Error : album not found in the db`;
  }
};

const deleteReminderEventDAO = async (reminder_id) => {
  const remindersCollections = await remindersCollection();
  const deletedReminderInfo = await remindersCollections.findOneAndDelete({
    _id: new ObjectId(reminder_id),
  });
  if (deletedReminderInfo.value === null) {
    throw `Error : could not delete the reminder event`;
  }
};

const updateReminderByReminderIdDAO = async (reminder_id, reminderEvent) => {
  const remindersCollections = await remindersCollection();
  remindersCollections.replaceOne(
    {
      _id: new ObjectId(reminder_id),
    },
    reminderEvent,
    { upsert: false }
  );
};

const insertReminderEventDAO = async (reminder) => {
  const reminderInstance = await remindersCollection();
  const insertInfo = await reminderInstance.insertOne(reminder);
  if (insertInfo === null) {
    throw `Error : MongoDB Failure`;
  } else if (
    !(
      insertInfo.acknowledged === true &&
      insertInfo.insertedId instanceof ObjectId
    )
  ) {
    throw `Error : during insertion of reminders to db`;
  }
  return insertInfo.insertedId;
};

const insertReminderIdToUserCollectionDAO = async (user_id, reminder_id) => {
  const usersInstance = await usersCollection();
  let updateInfo = await usersInstance.updateOne(
    { _id: new ObjectId(user_id) },
    {
      $push: { reminderIds: reminder_id },
    }
  );
  if (updateInfo === null) {
    throw `Error : while updating the document`;
  } else if (!(updateInfo.modifiedCount === 1)) {
    throw `Error : user not present in the db`;
  }
};

const getSingleReminderEventDAO = async (reminder_id) => {
  const reminderInstance = await remindersCollection();
  const reminder = await reminderInstance.findOne({
    _id: new ObjectId(reminder_id),
  });
  if (!reminder) {
    throw `Error : No band with that id`;
  }
  return reminder;
};

const getUserDAO = async (user_id) => {
  const usersInstance = await usersCollection();
  let user = await usersInstance.findOne({ _id: new ObjectId(user_id) });
  if (user === null) {
    throw `Error : user look up error`;
  }
  return user;
};

const getAllReminderEventsDAO = async (user_id) => {
  let user = await getUserDAO(user_id);
  const reminderInstance = await remindersCollection();
  const reminderEvents = await reminderInstance
    .find({
      _id: { $in: user.reminderIds },
    })
    .toArray();
  if (reminderEvents === null) {
    throw `Error : Unexpected DB crash while accessing database `;
  }
  return reminderEvents;
};

const getReminderEventsByGroupDAO = async (group_id) => {
  const reminderInstance = await remindersCollection();
  const reminderEvents = await reminderInstance
    .find({
      groupId: new ObjectId(group_id),
    })
    .toArray();
  if (reminderEvents === null) {
    throw `Error : Unexpected DB crash while accessing database `;
  }
  return reminderEvents;
};

/** DAO Layer End */
