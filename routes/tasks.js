import { Router } from "express";
import tasksDataFunctions from "../data/tasks.js";
import utils from "../utils/utils.js";
import constants from "../constants/constants.js";
import dayjs from "dayjs";
import xss from "xss";

const router = Router();
import xss from "xss";

router
  .route("/tasks/:userId")
  .get(utils.validateUserId, async (req, res) => {
    let userId = xss(req.params.userId);
    try {
      utils.checkObjectIdString(userId);
      userId = userId.trim();
    } catch (error) {
      res.status(400).json({ error: e.message });
    }
    try {
      const tasks = await tasksDataFunctions.getAllTasks(userId);
      res.json(tasks);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  })
  .post(utils.validateUserId, async (req, res) => {
    let userId = xss(req.params.userId);
    try {
      utils.checkObjectIdString(userId);
      userId = userId.trim();
    } catch (error) {
      res.status(400).json({ error: e.message });
    }
    try {
      let { title, textBody, dateAddedTo, priority, tag, checked } = req.body;

      title = xss(title);
      textBody = xss(textBody);
      dateAddedTo = xss(dateAddedTo);
      priority = xss(priority);
      tag = xss(tag);
      checked = xss(checked);

      utils.checkObjectIdString(userId);
      utils.validateStringInputWithMaxLength(
        title,
        "title",
        constants.stringLimits["title"]
      );

      if (typeof textBody === "string" && textBody.trim().length > 0) {
        utils.validateStringInputWithMaxLength(
          textBody,
          "textBody",
          constants.stringLimits["textBody"]
        );
      } else {
        textBody = "";
      }

      if (typeof dateAddedTo === "string" && dateAddedTo.trim().length > 0) {
        utils.validateDate(dateAddedTo, "dateAddedTo");
        dateAddedTo = dayjs(dateAddedTo.trim()).format("YYYY-MM-DDTHH:mm");
      } else {
        dateAddedTo = "";
      }
      utils.validatePriority(priority);

      if (typeof tag === "string" && tag.trim().length > 0) {
        utils.validateStringInputWithMaxLength(
          tag,
          "tag",
          constants.stringLimits["tag"]
        );
        tag = tag.trim();
      } else {
        tag = "tasks";
      }

      if (
        typeof checked === "undefined" ||
        checked.trim().length === 0 ||
        checked === "false"
      ) {
        checked = false;
      } else {
        if (typeof dateAddedTo === "string" && dateAddedTo.length === 0) {
          throw new Error(
            "Task cannot have completed status when its unassigned to a particular date"
          );
        }
        checked = true;
      }
      checked = utils.validateBooleanInput(checked, "checked");
      const newTask = await tasksDataFunctions.createTask(
        userId,
        title,
        textBody,
        dateAddedTo,
        priority,
        tag,
        checked
      );
      res.status(201).json({ userId: userId, taskId: newTask._id });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

router
  .route("/:userId/:taskId")
  .put(utils.validateUserId, async (req, res) => {
    try {
      utils.checkObjectIdString(req.params.userId);
      const userId = req.params.userId.trim();
      utils.checkObjectIdString(req.params.taskId);
      const taskId = req.params.taskId.trim();
      const taskPutData = req.body;
      let { title, textBody, dateAddedTo, priority, tag, checked } =
        taskPutData;
      if (!taskPutData || Object.keys(taskPutData).length === 0) {
        return res
          .status(400)
          .json({ error: "There are no fields in the request body" });
      }
      title = xss(title);
      textBody = xss(textBody);
      dateAddedTo = xss(dateAddedTo);
      priority = xss(priority);
      tag = xss(tag);
      checked = xss(checked);
      utils.validateStringInputWithMaxLength(
        title,
        "title",
        constants.stringLimits["title"]
      );

      if (typeof textBody === "string" && textBody.trim().length > 0) {
        utils.validateStringInputWithMaxLength(
          textBody,
          "textBody",
          constants.stringLimits["textBody"]
        );
        taskPutData.textBody = taskPutData.textBody.trim();
      } else {
        taskPutData.textBody = "";
      }
      if (typeof dateAddedTo === "string" && dateAddedTo.trim().length > 0) {
        utils.validateDate(dateAddedTo, "dateAddedTo");
        taskPutData.dateAddedTo = dayjs(dateAddedTo.trim()).format(
          "YYYY-MM-DDTHH:mm"
        );
      } else {
        taskPutData.dateAddedTo = "";
      }
      utils.validatePriority(priority);
      if (typeof tag === "string" && tag.trim().length > 0) {
        utils.validateStringInputWithMaxLength(
          tag,
          "tag",
          constants.stringLimits["tag"]
        );
        taskPutData.tag = tag.trim();
      } else {
        taskPutData.tag = "tasks";
      }

      if (
        typeof checked === "undefined" ||
        checked.trim().length === 0 ||
        checked === "false"
      ) {
        taskPutData.checked = false;
      } else {
        if (typeof dateAddedTo === "string" && dateAddedTo.length === 0) {
          throw new Error(
            "Task cannot have completed status when its unassigned to a particular date"
          );
        }
        taskPutData.checked = true;
      }
      taskPutData.checked = utils.validateBooleanInput(
        taskPutData.checked,
        "checked"
      );

      const updatedTask = await tasksDataFunctions.updateTask(
        taskId,
        taskPutData,
        userId
      );

      res.json({ userId: userId, taskId: updatedTask._id });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  })

  .delete(utils.validateUserId, async (req, res) => {
    let userId = xss(req.params.userId);
    let taskId = xss(req.params.taskId);
    try {
      utils.checkObjectIdString(userId);
      userId = userId.trim();
      utils.checkObjectIdString(taskId);
      taskId = taskId.trim();
      const removedTask = await tasksDataFunctions.removeTask(taskId, userId);
      res.json(removedTask);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  })
  .get(utils.validateUserId, async (req, res) => {
    let userId = xss(req.params.userId);
    let taskId = xss(req.params.taskId);
    try {
      utils.checkObjectIdString(userId);
      userId = userId.trim();
      utils.checkObjectIdString(taskId);
      taskId = taskId.trim();
      const task = await tasksDataFunctions.getTaskById(taskId, userId);
      res.json(task);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  });

router
  .route("/:userId/:taskId/dateAddedTo")
  .put(utils.validateUserId, async (req, res) => {
    let userId = xss(req.params.userId);
    let taskId = xss(req.params.taskId);
    try {
      utils.checkObjectIdString(userId);
      userId = userId.trim();
      utils.checkObjectIdString(req.params.taskId);
      taskId = taskId.trim();
      const taskPutData = await tasksDataFunctions.getTaskById(taskId, userId);
      let dateAddedTo = xss(req?.body?.dateAddedTo).trim();
      if (dateAddedTo === "") {
        return res.status(400).json({ error: e.message });
      }
      dateAddedTo = dayjs(dateAddedTo).format("YYYY-MM-DDTHH:mm");
      utils.checkIfDateIsBeyondRange(dateAddedTo);
      let previousDate = taskPutData.dateAddedTo;
      taskPutData.dateAddedTo = dateAddedTo;
      if (previousDate) {
        previousDate = dayjs(previousDate).format("YYYY-M-D");
      }
      if (!taskPutData || Object.keys(taskPutData).length === 0) {
        return res
          .status(400)
          .json({ error: "There are no fields in the request body" });
      }

      const updatedTask = await tasksDataFunctions.updateTask(
        taskId,
        taskPutData,
        userId
      );

      res.json({
        userId: userId,
        taskId: updatedTask._id,
        previousDate,
      });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
router
  .route("/:userId/:taskId/:isChecked")
  .put(utils.validateUserId, async (req, res) => {
    try {
      const taskId = xss(req.params.taskId);
      utils.checkObjectIdString(taskId);
      const userId = xss(req.params.userId);
      utils.checkObjectIdString(userId);
      let checked = xss(req.params.isChecked);
      if (
        typeof checked === "undefined" ||
        checked.trim().length === 0 ||
        checked === "false"
      ) {
        checked = false;
      } else {
        checked = true;
      }
      checked = utils.validateBooleanInput(checked, "checked");
      const task = await tasksDataFunctions.getTaskById(taskId, userId);
      //dont allow task to be checked if no date assigned

      if (checked && task.dateAddedTo == null) {
        throw new Error("Add a date to mark this task completed");
      }
      const taskPutData = {
        title: task.title,
        checked: checked,
        textBody: task.textBody,
        dateAddedTo: task.dateAddedTo,
        priority: task.priority,
        tag: task.tag,
      };
      const updatedTask = await tasksDataFunctions.updateTask(
        taskId,
        taskPutData,
        userId
      );
      res.json({ userId: userId, taskId: updatedTask._id });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

export default router;
