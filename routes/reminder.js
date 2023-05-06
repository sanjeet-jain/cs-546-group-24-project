import { Router } from "express";
const router = Router();
import utils from "../utils/utils.js";
import * as reminderManager from "../data/reminder.js";
import constants from "./../constants/constants.js";
import dayjs from "dayjs";

router
  .route("/:userId")
  .get(utils.validateUserId, async (req, res) => {
    let userId = xss(req.params.userId);
    try {
      utils.checkObjectIdString(userId);
      userId = userId.trim();
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
    let userId = xss(req.params.userId);
    let title = xss(reminder.title);
    let textBody = xss(reminder.textBody);
    let priority = Number.parseInt(xss(reminder.priority));
    let tag = xss(reminder.tag);
    let repeating =
      reminder.repeating === "true" || !(reminder.repeating === "false")
        ? true
        : false;
    let dateAddedTo = xss(reminder.dateAddedTo);
    let endDateTime;
    let repeatingIncrementBy;

    try {
      utils.checkObjectIdString(userId);
      userId = userId.trim();
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
      dateAddedTo = dayjs(reminder.dateAddedTo.trim()).format(
        "YYYY-MM-DDTHH:mm"
      );
      repeating = utils.validateBooleanInput(repeating);
      if (repeating) {
        endDateTime = xss(reminder.endDateTime);
        utils.validateDate(endDateTime, "end time value");
        endDateTime = dayjs(endDateTime.trim()).format("YYYY-MM-DDTHH:mm");
        repeatingIncrementBy = xss(reminder.repeatingIncrementBy);
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
    let reminder_id = xss(req.params.reminder_id);
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
  .put(utils.validateUserId, async (req, res) => {
    let reminder_id = xss(req.params.reminder_id);
    let reminder = req.body;
    let userId = xss(req.params.userId);
    let title = xss(reminder.title);
    let textBody = xss(reminder.textBody);
    let priority = Number.parseInt(xss(reminder.priority));
    let tag = xss(reminder.tag);
    let dateAddedTo = xss(reminder.dateAddedTo);
    let repeating = xss(reminder.repeating);
    repeating =
      repeating === "true" || repeating === true || !(repeating === "false")
        ? true
        : false;

    let endDateTime;
    if (repeating) {
      endDateTime = xss(reminder.endDateTime);
      utils.validateDate(endDateTime, "end time value");
      endDateTime = dayjs(endDateTime).format("YYYY-MM-DDTHH:mm");
    }
    let repeatingIncrementBy;
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
      dateAddedTo = dayjs(dateAddedTo.trim()).format("YYYY-MM-DDTHH:mm");
      repeating = utils.validateBooleanInput(repeating);
      if (repeating) {
        endDateTime = xss(reminder.endDateTime);
        utils.validateDate(endDateTime, "end date value");
        endDateTime = dayjs(endDateTime).format("YYYY-MM-DDTHH:mm");
        repeatingIncrementBy = xss(reminder.repeatingIncrementBy);
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
      res.status(200).json("The update of reminder event is sucessful");
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  })
  .delete(utils.validateUserId, async (req, res) => {
    let reminder_id = xss(req.params.reminder_id);
    let userId = xss(req.params.userId);
    try {
      utils.checkObjectIdString(reminder_id);
      utils.checkObjectIdString(userId);
      reminder_id = reminder_id.trim();
      userId = userId.trim();
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
    let reminder_id = xss(req.params.reminder_id);
    let userId = xss(req.params.userId);
    try {
      utils.checkObjectIdString(reminder_id);
      utils.checkObjectIdString(userId);
      reminder_id = reminder_id.trim();
      userId = userId.trim();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    reminderManager.deleteAllRecurrences(userId, reminder_id);
    res.json("All reminder events have been successfully deleted");
  });

export default router;
