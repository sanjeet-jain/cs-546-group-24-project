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
    let isRepeating = reminder.isRepeating;
    let endDateTime = new Date(reminder.endDateTime);
    let repeatType = reminder.repeatType;
    let dateTimeAddedTo = new Date(reminder.dateTimeAddedTo);
    try {
      console.log(typeof user_id);
      utils.checkObjectIdString(user_id);
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
      utils.validateDate(dateTimeAddedTo);
      utils.validateBooleanInput(isRepeating);
      if (isRepeating) {
        utils.validateDate(endDateTime);
        utils.validateRepeatingIncrementBy(repeatType);
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
        isRepeating,
        endDateTime,
        repeatType,
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
    let isRepeating = reminder.isRepeating;
    let endDateTime = new Date(reminder.endDateTime);
    let repeatType = reminder.repeatType;
    try {
      utils.checkObjectIdString(reminder_id);
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
      utils.validateDate(dateTimeAddedTo);
      utils.validateBooleanInput(isRepeating);
      if (!flagForUpdateSingleReminderUpdate) {
        utils.validateDate(endDateTime);
        utils.validateRepeatingIncrementBy(repeatType);
      } else {
        repeatType = null;
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
        isRepeating,
        endDateTime,
        repeatType,
        flagForUpdateSingleReminderUpdate
      );
      res.status().json("The update of reminder event is sucessful");
    } catch (e) {
      return res.status().json({ error: e });
    }
  })
  .delete(async (req, res) => {});

export default router;
