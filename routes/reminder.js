import { Router } from "express";
const router = Router();
import utils from "../utils/utils.js";
import * as reminderManager from "../data/reminder.js";
import constants from "./../constants/constants.js";
import dayjs from "dayjs";
import xss from "xss";

router
  .route("/:userId")
  .get(utils.validateUserId, async (req, res) => {
    let userId = req.params.userId;
    try {
      utils.checkObjectIdString(userId);
      userId = xss(userId.trim());
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      res.json(await reminderManager.getAllReminders(userId));
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  })
  .post(utils.validateUserId, async (req, res) => {
    const reminder = req.body;
    let userId = req.params.userId;
    let title = xss(reminder.title);
    let textBody = xss(reminder.textBody);
    let tag = xss(reminder.tag);
    let priority = xss(Number.parseInt(reminder.priority));
    let repeating = xss(reminder.repeating);
    let dateAddedTo = xss(reminder.dateAddedTo);
    let endDateTime;
    let repeatingIncrementBy = xss(reminder.repeatingIncrementBy);
    dateAddedTo = dayjs(dateAddedTo).format("YYYY-MM-DDTHH:mm");
    try {
      utils.checkObjectIdString(userId);
      userId = xss(userId.trim());
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
        endDateTime = xss(reminder.endDateTime);
        endDateTime = dayjs(endDateTime).format("YYYY-MM-DDTHH:mm");
        utils.validateDate(endDateTime, "end time value");
        utils.validateRepeatingIncrementBy(repeatingIncrementBy);
      }
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      await reminderManager.createReminder(
        userId,
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
  .route("/:userId/reminder/:reminder_id")
  .get(utils.validateUserId, async (req, res) => {
    let userId = req.params.userId;
    let reminder_id = req.params.reminder_id;
    try {
      utils.checkObjectIdString(userId);
      userId = xss(userId.trim());
      utils.checkObjectIdString(reminder_id);
      reminder_id = xss(reminder_id.trim());
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      res.json(await reminderManager.getReminder(reminder_id));
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  })
  .put(utils.validateUserId, async (req, res) => {
    let reminder_id = req.params.reminder_id;
    let reminder = req.body;
    let userId = req.params.userId;
    let title = xss(reminder.title);
    let textBody = xss(reminder.textBody);
    let priority = xss(Number.parseInt(reminder.priority));
    let tag = xss(reminder.tag);
    let dateAddedTo = xss(reminder.dateAddedTo);
    let repeating = xss(reminder.repeating);
    let endDateTime;
    let repeatingIncrementBy = xss(reminder.repeatingIncrementBy);

    dateAddedTo = dayjs(dateAddedTo).format("YYYY-MM-DDTHH:mm");
    repeating =
      repeating === "true" || repeating === true || !(repeating === "false")
        ? true
        : false;

    if (repeating) {
      endDateTime = xss(reminder.endDateTime);
      endDateTime = dayjs(endDateTime).format("YYYY-MM-DDTHH:mm");
    }

    try {
      utils.checkObjectIdString(reminder_id);
      reminder_id = xss(reminder_id.trim());
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
        userId,
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
      res.status(200).json("The update of reminder event is successful");
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  })
  .delete(utils.validateUserId, async (req, res) => {
    let reminder_id = req.params.reminder_id;
    let userId = req.params.userId;
    try {
      utils.checkObjectIdString(reminder_id);
      utils.checkObjectIdString(userId);
      reminder_id = xss(reminder_id.trim());
      userId = xss(userId.trim());
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      reminderManager.deleteReminderSingle(userId, reminder_id);
      res.json("The Reminder Events were successfully deleted in the db");
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  });

router
  .route("/:userId/reminders/:reminder_id")
  .delete(utils.validateUserId, async (req, res) => {
    let reminder_id = req.params.reminder_id;
    let userId = req.params.userId;
    try {
      utils.checkObjectIdString(reminder_id);
      utils.checkObjectIdString(userId);
      reminder_id = xss(reminder_id.trim());
      userId = xss(userId.trim());
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    reminderManager.deleteAllRecurrences(userId, reminder_id);
    res.json("All reminder events have been successfully deleted");
  });

export default router;
