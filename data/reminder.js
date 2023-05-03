import utils from "../utils/utils.js";
import { ObjectId } from "mongodb";
import {
  usersCollection,
  remindersCollection,
} from "./../config/mongoCollections.js";

import constants from "./../constants/constants.js";

import dayjs from "dayjs";

/** API Reminder.js */
export const createReminder = async (
  user_id,
  title,
  textBody,
  priority,
  tag,
  repeating,
  endDateTime,
  repeatingIncrementBy,
  dateAddedTo
) => {
  utils.checkObjectIdString(user_id);
  user_id = user_id.trim();
  utils.validateStringInputWithMaxLength(
    title,
    "title",
    constants.stringLimits["title"]
  );
  title = title.trim();

  if (
    textBody != null &&
    typeof textBody === "string" &&
    textBody.trim().length > 0
  ) {
    utils.validateStringInputWithMaxLength(
      textBody,
      "text body",
      constants.stringLimits["textBody"]
    );
    textBody = textBody.trim();
  } else {
    textBody = null;
  }

  utils.validatePriority(priority, "priority");

  if (typeof tag === "string" && tag.trim().length > 0) {
    utils.validateStringInputWithMaxLength(
      tag,
      "tag",
      constants.stringLimits["tag"]
    );
    tag = tag.trim().toLowerCase();
  } else {
    tag = "reminders";
  }

  let dateCreated = dayjs().format("YYYY-MM-DDTHH:mm");
  utils.validateDate(dateAddedTo, "date time value");
  utils.validateBooleanInput(repeating);
  if (repeating) {
    endDateTime = dayjs(endDateTime).format("YYYY-MM-DDTHH:mm");
    utils.validateDate(endDateTime, "end date value");
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
    if (
      dayjs(dateAddedTo).diff(dayjs(reminderEvents[i].dateAddedTo)) === 0 &&
      title.toLowerCase() === reminderEvents[i].title.toLowerCase() &&
      tag === reminderEvents[i].tag
    ) {
      throw new Error(
        "Error : No Two reminders can have same title tag and time"
      );
    }
  }
  const reminder = {
    title: title,
    textBody: textBody,
    priority: priority,
    tag: tag,
    repeating: repeating,
    endDateTime: endDateTime,
    repeatingIncrementBy: repeatingIncrementBy,
    expired: false,
    dateAddedTo: dateAddedTo,
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
    let keySets = Object.keys(reminderIdObj);
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
  dateAddedTo,
  repeating,
  endDateTime,
  repeatingIncrementBy
) => {
  utils.checkObjectIdString(reminder_id);
  reminder_id = reminder_id.trim();
  utils.validateStringInputWithMaxLength(
    title,
    "title",
    constants.stringLimits["title"]
  );
  title = title.trim();

  if (
    textBody != null &&
    typeof textBody === "string" &&
    textBody.trim().length > 0
  ) {
    utils.validateStringInputWithMaxLength(
      textBody,
      "text body",
      constants.stringLimits["textBody"]
    );
    textBody = textBody.trim();
  } else {
    textBody = null;
  }

  utils.validatePriority(priority, "priority");
  /**
   * Tags should be case insensitive and all tags should be converted to lowercase
   */
  if (typeof tag === "string" && tag.trim().length > 0) {
    utils.validateStringInputWithMaxLength(
      tag,
      "tag",
      constants.stringLimits["tag"]
    );
    tag = tag.trim().toLowerCase();
  } else {
    tag = "reminders";
  }
  let dateCreated = dayjs(new Date()).format("YYYY-MM-DDTHH:mm");
  utils.validateDate(dateAddedTo, "date time value");
  utils.validateBooleanInput(repeating);

  if (repeating) {
    utils.validateDate(endDateTime, "end time value");
    utils.validateRepeatingIncrementBy(repeatingIncrementBy);
  } else {
    //repeatCounter = 0;
    repeatingIncrementBy = null;
  }
  let currReminder = await getReminder(reminder_id);

  const reminderObj = {
    title: title,
    textBody: textBody,
    priority: priority,
    tag: tag,
    dateCreated: dateCreated,
    dateAddedTo: dateAddedTo,
    repeating: repeating,
    endDateTime: endDateTime,
    repeatingIncrementBy: repeatingIncrementBy,
    type: "reminder",
    expired: false,
  };
  /**
   * This code causes update for single recurrence and normal update
   */
  if (!repeating && !currReminder.repeating) {
    reminderObj.repeating = false;
    reminderObj.endDateTime = null;
    reminderObj.repeatingIncrementBy = null;
    reminderObj.groupId = null;
    isTwoEventSame(reminderObj, currReminder);
    await updateReminderByReminderIdDAO(reminder_id, reminderObj);
  } else if (repeating && !currReminder.repeating) {
    //delete the reminder event and add new recurrence
    await deleteReminderEventDAO(reminder_id);
    await deleteReminderFromUserCollectionDAO(user_id, reminder_id);
    await createReminder(
      user_id,
      title,
      textBody,
      priority,
      tag,
      repeating,
      endDateTime,
      repeatingIncrementBy,
      dateAddedTo
    );
  } else if (repeating && currReminder.repeating) {
    // Reminder was repeating and now change its content
    if (
      dayjs(currReminder.dateAddedTo).diff(dayjs(dateAddedTo)) === 0 &&
      dayjs(currReminder.endDateTime).diff(dayjs(endDateTime)) === 0
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
        repeatingIncrementBy,
        dateAddedTo
      );
    }
  } else if (!repeating && currReminder.repeating) {
    await deleteReminderEventDAO(reminder_id);
    await deleteReminderFromUserCollectionDAO(user_id, reminder_id);
    await createReminder(
      user_id,
      title,
      textBody,
      priority,
      tag,
      repeating,
      endDateTime,
      repeatingIncrementBy,
      dateAddedTo
    );
  }
};

export const deleteReminderSingle = async (user_id, reminder_id) => {
  await deleteReminderEventDAO(reminder_id);
  await deleteReminderFromUserCollectionDAO(user_id, reminder_id);
};

export const getDistinctTags = async () => {
  const reminderInstance = await remindersCollection();
  return reminderInstance.distinct("tag");
};

// export const deleteReminder = async (user_id, reminder_id, flag) => {
//   utils.checkObjectIdString(user_id);
//   user_id = user_id.trim();
//   utils.checkObjectIdString(reminder_id);
//   reminder_id = reminder_id.trim();
//   utils.validateBooleanInput(flag);
//   if (flag) {
//     await deleteReminderEventDAO(reminder_id);
//     await deleteReminderFromUserCollectionDAO(user_id, reminder_id);
//   } else {
//     await deleteAllRecurrences(user_id, reminder_id);
//   }
// };

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
    if (result.matchedCount == 0) throw new Error("Reminder not found");
    if (result.modifiedCount == 0)
      throw new Error("Reminder Details haven't Changed");
    if (result.acknowledged !== true)
      throw new Error("Reminder update wasnt successfull");
  }
};

export const deleteAllRecurrences = async (user_id, reminder_id) => {
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
  let currentDate = reminder.dateAddedTo;
  let endDateTime = reminder.endDateTime;
  reminder.groupId = new ObjectId();
  while (dayjs(endDateTime).diff(dayjs(currentDate)) >= 0) {
    reminder.dateAddedTo = currentDate;
    listOfEvents.push(constructNewReminderObj(reminder));
    if (reminder.repeatingIncrementBy === "day") {
      currentDate = dayjs(currentDate).add(1, "day").format("YYYY-MM-DDTHH:mm");
    } else if (reminder.repeatingIncrementBy === "week") {
      currentDate = dayjs(currentDate).add(7, "day").format("YYYY-MM-DDTHH:mm");
    } else if (reminder.repeatingIncrementBy === "month") {
      currentDate = dayjs(currentDate)
        .add(1, "month")
        .format("YYYY-MM-DDTHH:mm");
    } else if (reminder.repeatingIncrementBy === "year") {
      currentDate = dayjs(currentDate)
        .add(1, "year")
        .format("YYYY-MM-DDTHH:mm");
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
    dateAddedTo: dayjs(reminderEvent.dateAddedTo).format("YYYY-MM-DDTHH:mm"),
    repeating: reminderEvent.repeating,
    endDateTime: reminderEvent.endDateTime,
    repeatingIncrementBy: reminderEvent.repeatingIncrementBy,
    expired: reminderEvent.expired,
    groupId: reminderEvent.groupId,
    type: "reminder",
  };
  return reminderObj;
}

function isTwoEventSame(event1, event2) {
  let keys = [
    "title",
    "textBody",
    "priority",
    "tag",
    "dateAddedTo",
    "endDateTime",
    "repeatingIncrementBy",
    "repeating",
  ];
  let flag = true;
  for (let i = 0; i < keys.length; i++) {
    if (!(event1[keys[i]] === event2[keys[i]])) {
      flag = false;
    }
  }
  if (flag) {
    throw new Error("Trying to update same event value");
  }
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
      throw new Error("Reminder Details havent Changed");
    if (result.acknowledged !== true)
      throw new Error("Reminder update wasnt successfull");
  }
};

const addAllReminderIdsDAO = async (user_id, listOfReminderIds) => {
  const usersInstance = await usersCollection();
  const insertInfo = await usersInstance.updateOne(
    { _id: new ObjectId(user_id) },
    { $push: { reminderIds: { $each: listOfReminderIds } } }
  );
  if (insertInfo.modifiedCount === 0) {
    throw new Error(
      "User Ids were not successfully updated to the user collection"
    );
  }
};

const addAllReminderEventDAO = async (listOfReminderEvents) => {
  const reminderInstance = await remindersCollection();
  const insertInfo = await reminderInstance.insertMany(listOfReminderEvents);
  if (
    insertInfo.insertIds === null ||
    insertInfo.insertedCount !== listOfReminderEvents.length
  ) {
    throw new Error("List of reminder events was not successfully added to db");
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
    throw new Error("Error while updating the document");
  } else if (!(obj.modifiedCount === 1)) {
    throw new Error("Album not found in the db");
  }
};

const deleteReminderEventDAO = async (reminder_id) => {
  const remindersCollections = await remindersCollection();
  const deletedReminderInfo = await remindersCollections.findOneAndDelete({
    _id: new ObjectId(reminder_id),
  });
  if (deletedReminderInfo.value === null) {
    throw new Error(`Could not delete the reminder event`);
  }
};

const updateReminderByReminderIdDAO = async (reminder_id, reminderEvent) => {
  const remindersCollections = await remindersCollection();
  let replace = await remindersCollections.replaceOne(
    {
      _id: new ObjectId(reminder_id),
    },
    reminderEvent,
    { upsert: false }
  );
  if (!replace.acknowledged === true) {
    throw new Error(" Error in updating reminder event");
  } else if (replace.matchedCount < 1 || replace.matchedCount > 1) {
    throw new Error("Multiple or no event was found for reminder event");
  } else if (replace.modifiedCount !== 1) {
    throw new Error("All details are existing for the reminder event");
  }
};

const insertReminderEventDAO = async (reminder) => {
  const reminderInstance = await remindersCollection();
  const insertInfo = await reminderInstance.insertOne(reminder);
  if (insertInfo === null) {
    throw new Error("MongoDB Failure");
  } else if (
    !(
      insertInfo.acknowledged === true &&
      insertInfo.insertedId instanceof ObjectId
    )
  ) {
    throw new Error("Error : during insertion of reminders to db");
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
    throw new Error("Error while updating the document");
  } else if (!(updateInfo.modifiedCount === 1)) {
    throw new Error("Error : user not present in the db");
  }
};

const getSingleReminderEventDAO = async (reminder_id) => {
  const reminderInstance = await remindersCollection();
  const reminder = await reminderInstance.findOne({
    _id: new ObjectId(reminder_id),
  });
  if (!reminder) {
    throw new Error("Error : No band with that id");
  }
  return reminder;
};

const getUserDAO = async (user_id) => {
  const usersInstance = await usersCollection();
  let user = await usersInstance.findOne({ _id: new ObjectId(user_id) });
  if (user === null) {
    throw new Error("User look up error");
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
    throw new Error("Unexpected DB crash while accessing database");
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
    throw new Error("Unexpected DB crash while accessing database");
  }
  return reminderEvents;
};

/** DAO Layer End */
