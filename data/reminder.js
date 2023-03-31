/**
 * This is a DAO file for reminder.js
 */

import utils from "../utils/utils.js";
import { ObjectId } from "mongodb";
import { reminderCollection } from "../config/mongoCollections.js";

export const createReminder = async (
  user_id,
  title,
  textBody,
  priority,
  tag,
  isRepeating,
  repeatCounter,
  repeatType,
  isEventExpired,
  dateAddedTo,
  dateDueOn
) => {
  utils.validateObjectIdString(user_id);
  user_id = user_id.trim();
  utils.validateStringInput(title, "title");
  title = title.trim();
  utils.validateStringInput(textBody, "text body");
  textBody = textBody.trim();
  utils.validatePriority(priority, "priority");
  /**
   * Tags should be case insensitive and all tags should be converted to lowercase
   */
  utils.validateStringInput(tag, "tag");
  tag = tag.trim();
  tag = tag.toLowerCase();
  let dateCreated = new Date();
  /**
   * Date need not be entered while creating an event to make use of right pane functionality
   */
  if (dateAddedTo != null && dateDueOn != null) {
    utils.validateDateRange(dateAddedTo, dateDueOn);
  }
  utils.validateBooleanInput(isRepeating);
  if (isRepeating) {
    utils.validateRepeatingCounterIncrement(repeatCounter);
    utils.validateRepeatingIncrementBy(repeatType);
  } else {
    repeatCounter = -1;
    repeatType = null;
  }
  utils.validateBooleanInput(isEventExpired);
  /**
   * Check if two reminder titles be same or not meaning user passes same title tag and due date it ideally is a duplicate date
   */
  let reminderObj = null;
  if (dateAddedTo != null && dateDueOn != null) {
    reminderObj = {
      title: title,
      textBody: textBody,
      priority: priority,
      tag: tag,
      dateCreated: dateCreated,
      dateAddedTo: dateAddedTo,
      dateDueOn: dateDueOn,
      isRepeating: isRepeating,
      repeatCounter: repeatCounter,
      repeatType: repeatType,
      isEventExpired: isEventExpired,
      user_id: new ObjectId(user_id),
    };
  } else {
    reminderObj = {
      title: title,
      textBody: textBody,
      priority: priority,
      tag: tag,
      dateCreated: dateCreated,
      isRepeating: isRepeating,
      repeatCounter: repeatCounter,
      repeatType: repeatType,
      isEventExpired: isEventExpired,
      user_id: new ObjectId(user_id),
    };
  }
  const reminderCollections = await reminderCollection();
  const insertInfo = await reminderCollections.insertOne(reminderObj);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw `Error : while inserting the reminder event`;
  }
  return true;
};

export const getReminder = async (user_id, reminder_id) => {
  utils.validateObjectIdString(user_id);
  user_id = user_id.trim();
  utils.validateObjectIdString(reminder_id);
  reminder_id = reminder_id.trim();
  const reminderCollections = await reminderCollection();
  const reminder = await reminderCollections.find({
    user_id: new ObjectId(user_id),
    _id: new ObjectId(reminder_id),
  });
  if (!reminder) {
    throw `Error : while retrieving reminder from database`;
  }
  reminder.user_id = reminder.user_id.toString();
  reminder._id = reminder._id.toString();
  return reminder;
};

export const getAllReminders = async (user_id) => {
  utils.validateObjectIdString(user_id);
  user_id = user_id.trim();
  utils.validateObjectIdString(reminder_id);
  reminder_id = reminder_id.trim();
  const reminderCollections = await reminderCollection();
  const remindersArr = await reminderCollections
    .find({
      user_id: new ObjectId(user_id),
    })
    .toArray();
  if (!remindersArr) {
    throw `Error : while retrieving all the reminders from database`;
  }
};

export const updateReminder = async (
  user_id,
  reminder_id,
  title,
  textBody,
  priority,
  tag,
  dateAddedTo,
  dateDueOn,
  isRepeating,
  repeatCounter,
  repeatType,
  isEventExpired
) => {
  utils.validateObjectIdString(user_id);
  user_id = user_id.trim();
  utils.validateObjectIdString(reminder_id);
  reminder_id = reminder_id.trim();
  utils.validateStringInput(title, "title");
  title = title.trim();
  utils.validateStringInput(textBody, "text body");
  textBody = textBody.trim();
  utils.validatePriority(priority, "priority");
  /**
   * Tags should be case insensitive and all tags should be converted to lowercase
   */
  utils.validateStringInput(tag, "tag");
  tag = tag.trim();
  tag = tag.toLowerCase();
  let dateCreated = new Date();
  if (dateAddedTo != null && dateDueOn != null) {
    utils.validateDateRange(dateAddedTo, dateDueOn);
  }
  utils.validateBooleanInput(isRepeating);
  if (isRepeating) {
    utils.validateRepeatingCounterIncrement(repeatCounter);
    utils.validateRepeatingIncrementBy(repeatType);
  } else {
    repeatCounter = -1;
    repeatType = null;
  }
  utils.validateBooleanInput(isEventExpired);

  let updatedReminder = null;
  if (dateAddedTo != null && dateDueOn != null) {
    updatedReminder = {
      title: title,
      textBody: textBody,
      priority: priority,
      tag: tag,
      dateCreated: dateCreated,
      dateAddedTo: dateAddedTo,
      dateDueOn: dateDueOn,
      isRepeating: isRepeating,
      repeatCounter: repeatCounter,
      repeatType: repeatType,
      isEventExpired: isEventExpired,
      user_id: new ObjectId(user_id),
    };
  } else {
    updatedReminder = {
      title: title,
      textBody: textBody,
      priority: priority,
      tag: tag,
      dateCreated: dateCreated,
      isRepeating: isRepeating,
      repeatCounter: repeatCounter,
      repeatType: repeatType,
      isEventExpired: isEventExpired,
      user_id: new ObjectId(user_id),
    };
  }
  const reminderCollections = await reminderCollection();
  reminderCollections.replaceOne(
    {
      user_id: new ObjectId(user_id),
      _id: new ObjectId(reminder_id),
    },
    updatedReminder,
    { upsert: false }
  );
};

export const deleteReminder = async (user_id, reminder_id) => {
  utils.validateObjectIdString(user_id);
  user_id = user_id.trim();
  utils.validateObjectIdString(reminder_id);
  reminder_id = reminder_id.trim();
  const reminderCollections = await reminderCollection();
  const deletedReminderInfo = reminderCollections.findOneAndDelete({
    user_id: new ObjectId(user_id),
    _id: new ObjectId(reminder_id),
  });
  if (deletedReminderInfo.value === null) {
    throw `Error : could not delete the reminder event`;
  }
};


/**
 * 
 * Given Due Date & Date added 
 */

const toRenderTheReminder = async(dateAddedTo,dateDueOn,repeatCOunt )=>{

}