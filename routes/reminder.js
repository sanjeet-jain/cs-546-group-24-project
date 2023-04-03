import { Router } from "express";
const router = Router();
import utils from "../utils/utils.js";
import * as reminderManager from "../data/reminder.js";

router
  .route("/:user_id")
  .get(async (req, res) => {
    console.log("Hello ");
    let user_id = req.params.user_id;
    try {
      utils.checkObjectIdString(user_id);
      user_id = user_id.trim();
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      res.json(await reminderManager.getAllReminders(user_id));
    } catch (e) {
      return res.status(404).json({ error: e });
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
    let endDateTime = new Date(reminder.endDateTime);
    let repeatingIncrementBy = reminder.repeatingIncrementBy;
    let dateTimeAddedTo = utils.getNewDateObjectFromString();
    let repeatingCounterIncrement = reminder.repeatingCounterIncrement;
    try {
      console.log(typeof user_id);
      utils.checkObjectIdString(user_id);
      user_id = user_id.trim();
      utils.validateStringInput(
        title,
        "title",
        constants.stringLimits["title"]
      );
      title = title.trim();
      utils.validateStringInput(
        textBody,
        "text body",
        constants.stringLimits["textBody"]
      );
      textBody = textBody.trim();
      utils.validateStringInput(
        priority,
        "priority",
        constants.stringLimits["priority"]
      );
      /**
       * Tags should be case insensitive and all tags should be converted to lowercase
       */
      utils.validateStringInput(tag, "tag", constants.stringLimits["tag"]);
      tag = tag.trim();
      utils.validateDateObj(dateTimeAddedTo,"date time value");
      utils.validateBooleanInput(repeating);
      if (repeating) {
        utils.validateDateObj(endDateTime,"end time value");
        utils.validateRepeatingIncrementBy(repeatingIncrementBy);
      }
    } catch (e) {
      return res.status(400).json({ error: e });
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
        dateTimeAddedTo
      );
      res.status(200).json("Reminder Event is successfully added to the DB");
    } catch (e) {
      res.status(500).json({ error: e });
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
      return res.status(400).json({ error: e });
    }
    try {
      res.json(await reminderManager.getReminder(reminder_id));
    } catch (e) {
      res.status(500).json({ error: e });
    }
  })
  .put(async (req, res) => {
    let reminder_id = req.params.reminder_id;
    let reminder = req.body;
    let user_id = req.params.user_id;
    let flagForUpdateSingleReminderUpdate =
      req.params.flag === "true" ? true : false;
    let title = reminder.title;
    let textBody = reminder.textBody;
    let priority = reminder.priority;
    let tag = reminder.tag;
    let dateTimeAddedTo = new Date(reminder.dateTimeAddedTo);
    let repeating = reminder.repeating;
    let endDateTime = new Date(reminder.endDateTime);
    let repeatingIncrementBy = reminder.repeatingIncrementBy;
    let repeatingCounterIncrement = reminder.repeatingCounterIncrement;
    try {
      utils.checkObjectIdString(reminder_id);
      reminder_id = reminder_id.trim();
      utils.validateStringInput(
        title,
        "title",
        constants.stringLimits["title"]
      );
      title = title.trim();
      utils.validateStringInput(
        textBody,
        "text body",
        constants.stringLimits["textBody"]
      );
      textBody = textBody.trim();
      utils.validateStringInput(
        priority,
        "priority",
        constants.stringLimits["priority"]
      );
      /**
       * Tags should be case insensitive and all tags should be converted to lowercase
       */
      utils.validateStringInput(tag, "tag", constants.stringLimits["tag"]);
      tag = tag.trim();
      utils.validateDateObj(dateTimeAddedTo,"date time added to value");
      utils.validateBooleanInput(repeating);
      if (!flagForUpdateSingleReminderUpdate) {
        utils.validateDateObj(endDateTime,"end date value");
        utils.validateRepeatingIncrementBy(repeatingIncrementBy);
      } else {
        repeatingIncrementBy = null;
      }
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      await reminderManager.updateReminder(
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
      );
      res.status().json("The update of reminder event is sucessful");
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  })
  .delete(async (req, res) => {
    let reminder_id = req.params.reminder_id;
    let user_id = req.params.user_id;
    let flagForDeleteAllRecurrence = req.params.flag === "true" ? true : false;
    try {
      utils.checkObjectIdString(reminder_id);
      utils.checkObjectIdString(user_id);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      reminderManager.deleteReminder(
        user_id,
        reminder_id,
        flagForDeleteAllRecurrence
      );
      res.json("The Reminder Events were successfully deleted in the db");
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  });

export default router;
