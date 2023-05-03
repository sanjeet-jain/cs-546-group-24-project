import { Router } from "express";
const router = Router();
import utils from "../utils/utils.js";
import * as reminderManager from "../data/reminder.js";
import constants from "./../constants/constants.js";
import dayjs from "dayjs";

router
  .route("/:user_id")
  .get(async (req, res) => {
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
    const reminder = req.body;
    let user_id = req.params.user_id;
    let title = reminder.title;
    let textBody = reminder.textBody;
    let priority = Number.parseInt(reminder.priority);
    let tag = reminder.tag;
    let repeating =
      reminder.repeating === "true" ||
      reminder.repeating === true ||
      !(reminder.repeating === "false")
        ? true
        : false;
    let dateAddedTo = reminder.dateAddedTo;
    let endDateTime;
    let repeatingIncrementBy = reminder.repeatingIncrementBy;
    dateAddedTo = dayjs(reminder.dateAddedTo).format("YYYY-MM-DDTHH:mm");
    try {
      utils.checkObjectIdString(user_id);
      user_id = user_id.trim();
      utils.validateStringInputWithMaxLength(
        title,
        "title",
        constants.stringLimits["title"]
      );
      title = title.trim();
      if (typeof textBody === "string" && textBody.trim().length > 0) {
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
      utils.validateDate(dateAddedTo, "date time value");
      repeating = utils.validateBooleanInput(repeating);
      if (repeating) {
        endDateTime = dayjs(reminder.endDateTime).format("YYYY-MM-DDTHH:mm");
        utils.validateDate(endDateTime, "end time value");
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
        repeatingIncrementBy,
        dateAddedTo
      );
      res.status(200).json("Reminder Event is successfully added to the DB");
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

router
  .route("/:user_id/reminder/:reminder_id")
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
    let title = reminder.title;
    let textBody = reminder.textBody;
    let priority = Number.parseInt(reminder.priority);
    let tag = reminder.tag;
    let dateAddedTo = dayjs(reminder.dateAddedTo).format("YYYY-MM-DDTHH:mm");
    let repeating =
      reminder.repeating === "true" ||
      reminder.repeating === true ||
      !(reminder.repeating === "false")
        ? true
        : false;
    let endDateTime;
    if (repeating) {
      endDateTime = dayjs(reminder.endDateTime).format("YYYY-MM-DDTHH:mm");
    }
    let repeatingIncrementBy = reminder.repeatingIncrementBy;
    try {
      utils.checkObjectIdString(reminder_id);
      reminder_id = reminder_id.trim();
      utils.validateStringInputWithMaxLength(
        title,
        "title",
        constants.stringLimits["title"]
      );
      title = title.trim();
      if (typeof textBody === "string" && textBody.trim().length > 0) {
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

      utils.validateDate(dateAddedTo, "date time added to value");
      repeating = utils.validateBooleanInput(repeating);
      if (repeating) {
        utils.validateDate(endDateTime, "end date value");
        utils.validateRepeatingIncrementBy(repeatingIncrementBy);
      } else {
        repeatingIncrementBy = null;
        endDateTime = null;
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
        repeatingIncrementBy
      );
      res.status(200).json("The update of reminder event is sucessful");
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  })
  .delete(async (req, res) => {
    let reminder_id = req.params.reminder_id;
    let user_id = req.params.user_id;
    try {
      utils.checkObjectIdString(reminder_id);
      utils.checkObjectIdString(user_id);
      reminder_id = reminder_id.trim();
      user_id = user_id.trim();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      reminderManager.deleteReminderSingle(user_id, reminder_id);
      res.json("The Reminder Events were successfully deleted in the db");
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  });

router.route("/:user_id/reminders/:reminder_id").delete(async (req, res) => {
  let reminder_id = req.params.reminder_id;
  let user_id = req.params.user_id;
  try {
    utils.checkObjectIdString(reminder_id);
    utils.checkObjectIdString(user_id);
    reminder_id = reminder_id.trim();
    user_id = user_id.trim();
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
  reminderManager.deleteAllRecurrences(user_id, reminder_id);
  res.json("All reminder events have been successfully deleted");
});

export default router;
