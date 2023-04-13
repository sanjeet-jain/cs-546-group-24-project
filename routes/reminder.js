import { Router } from "express";
const router = Router();
import utils from "../utils/utils.js";
import * as reminderManager from "../data/reminder.js";
import constants from "./../constants/constants.js";

router
  .route("/:user_id")
  .get(async (req, res) => {
    console.log("Hello ");
    let user_id = req.params.user_id;
    try {
      utils.checkObjectIdString(user_id);
      user_id = user_id.trim();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      res.json(await reminderManager.getAllReminders(user_id));
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  })
  .post(async (req, res) => {
    console.log("Inside Post Method");
    const reminder = req.body;
    let user_id = req.params.user_id;
    let title = reminder.title;
    let textBody = reminder.textBody;
    let priority = reminder.priority;
    let tag = reminder.tag;
    let repeating = reminder.repeating;
    let endDateTime;
    console.log(typeof reminder.endDateTime);
    if (typeof reminder.endDateTime !== "undefined") {
      endDateTime = utils.getNewDateObjectFromString(reminder.endDateTime);
    }

    let repeatingIncrementBy = reminder.repeatingIncrementBy;
    let dateAddedTo = utils.getNewDateObjectFromString(reminder.dateAddedTo);
    let repeatingCounterIncrement = reminder.repeatingCounterIncrement;
    try {
      console.log(typeof user_id);
      utils.checkObjectIdString(user_id);
      user_id = user_id.trim();
      utils.validateStringInputWithMaxLength(
        title,
        "title",
        constants.stringLimits["title"]
      );
      title = title.trim();
      utils.validateStringInputWithMaxLength(
        textBody,
        "text body",
        constants.stringLimits["textBody"]
      );
      textBody = textBody.trim();
      utils.validatePriority(priority, "priority");
      /**
       * Tags should be case insensitive and all tags should be converted to lowercase
       */
      utils.validateStringInputWithMaxLength(
        tag,
        "tag",
        constants.stringLimits["tag"]
      );
      tag = tag.trim();
      utils.validateDateObj(dateAddedTo, "date time value");
      utils.validateBooleanInput(repeating);
      if (repeating) {
        utils.validateDateObj(endDateTime, "end time value");
        utils.validateRepeatingIncrementBy(repeatingIncrementBy);
      }
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      await reminderManager.createReminder(
        user_id,
        title,
        textBody,
        priority,
        tag,
        repeating,
        endDateTime,
        repeatingCounterIncrement,
        repeatingIncrementBy,
        dateAddedTo
      );
      res.status(200).json("Reminder Event is successfully added to the DB");
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

router
  .route("/:user_id/reminder/:reminder_id&:flag")
  .get(async (req, res) => {
    let reminder_id = req.params.reminder_id;
    try {
      utils.checkObjectIdString(reminder_id);
      reminder_id = reminder_id.trim();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      res.json(await reminderManager.getReminder(reminder_id));
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  })
  .put(async (req, res) => {
    let reminder_id = req.params.reminder_id;
    let reminder = req.body;
    let user_id = req.params.user_id;
    let flagForUpdateSingleReminderUpdate =
      typeof req.params.flag === "undefined" || req.params.flag !== "false"
        ? true
        : false;
    let title = reminder.title;
    let textBody = reminder.textBody;
    let priority = reminder.priority;
    let tag = reminder.tag;

    let dateAddedTo = utils.getNewDateObjectFromString(reminder.dateAddedTo);
    let repeating = reminder.repeating;
    let endDateTime;
    if (!typeof reminder.endDateTime === "undefined") {
      endDateTime = utils.getNewDateObjectFromString(reminder.endDateTime);
    }
    let repeatingIncrementBy = reminder.repeatingIncrementBy;
    let repeatingCounterIncrement = reminder.repeatingCounterIncrement;
    try {
      utils.checkObjectIdString(reminder_id);
      reminder_id = reminder_id.trim();
      utils.validateStringInputWithMaxLength(
        title,
        "title",
        constants.stringLimits["title"]
      );
      title = title.trim();
      utils.validateStringInputWithMaxLength(
        textBody,
        "text body",
        constants.stringLimits["textBody"]
      );
      textBody = textBody.trim();
      utils.validatePriority(priority, "priority");
      /**
       * Tags should be case insensitive and all tags should be converted to lowercase
       */
      utils.validateStringInputWithMaxLength(
        tag,
        "tag",
        constants.stringLimits["tag"]
      );
      tag = tag.trim();
      utils.validateDateObj(dateAddedTo, "date time added to value");
      utils.validateBooleanInput(repeating);
      if (!flagForUpdateSingleReminderUpdate) {
        utils.validateDateObj(endDateTime, "end date value");
        utils.validateRepeatingIncrementBy(repeatingIncrementBy);
      } else {
        repeatingIncrementBy = null;
      }
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      await reminderManager.updateReminder(
        user_id,
        reminder_id,
        title,
        textBody,
        priority,
        tag,
        dateAddedTo,
        repeating,
        endDateTime,
        repeatingCounterIncrement,
        repeatingIncrementBy,
        flagForUpdateSingleReminderUpdate
      );
      res.status().json("The update of reminder event is sucessful");
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  })
  .delete(async (req, res) => {
    let reminder_id = req.params.reminder_id;
    let user_id = req.params.user_id;
    let flagToDeleteSingleRecurrence =
      typeof req.params.flag === "undefined" || req.params.flag !== "false"
        ? true
        : false;
    try {
      utils.checkObjectIdString(reminder_id);
      utils.checkObjectIdString(user_id);
      reminder_id = reminder_id.trim();
      user_id = user_id.trim();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      reminderManager.deleteReminder(
        user_id,
        reminder_id,
        flagToDeleteSingleRecurrence
      );
      res.json("The Reminder Events were successfully deleted in the db");
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  });

export default router;
