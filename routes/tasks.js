import { Router } from "express";
import tasksDataFunctions from "../data/tasks.js";
import utils from "../utils/utils.js";
import constants from "../constants/constants.js";

const router = Router();

router
  .route("/tasks/:userId")
  .get(async (req, res) => {
    let userId = req.params.userId;
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
  .post(async (req, res) => {
    let userId = req.params.userId;
    try {
      utils.checkObjectIdString(userId);
      userId = userId.trim();
    } catch (error) {
      res.status(400).json({ error: e.message });
    }
    try {
      let { title, textBody, dateAddedTo, priority, tag, checked } = req.body;
      utils.checkObjectIdString(userId);
      utils.validateStringInputWithMaxLength(
        title,
        "title",
        constants.stringLimits["title"]
      );
      utils.validateStringInputWithMaxLength(
        textBody,
        "textBody",
        constants.stringLimits["textBody"]
      );
      utils.validateDate(dateAddedTo, "dateAddedTo");
      utils.validatePriority(priority);
      utils.validateStringInputWithMaxLength(
        tag,
        "tag",
        constants.stringLimits["tag"]
      );
      if (typeof checked === "undefined") {
        checked = false;
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
  .put(async (req, res) => {
    try {
      const taskId = req.params.taskId.trim();
      utils.checkObjectIdString(taskId);
      const userId = req.params.userId.trim();
      utils.checkObjectIdString(userId);
      const taskPutData = req.body;
      let { title, textBody, dateAddedTo, priority, tag, checked } =
        taskPutData;
      if (!taskPutData || Object.keys(taskPutData).length === 0) {
        return res
          .status(400)
          .json({ error: "There are no fields in the request body" });
      }
      utils.validateStringInputWithMaxLength(
        title,
        "title",
        constants.stringLimits["title"]
      );
      utils.validateStringInputWithMaxLength(
        textBody,
        "textBody",
        constants.stringLimits["textBody"]
      );
      utils.validateDate(dateAddedTo, "dateAddedTo");
      utils.validatePriority(priority);
      utils.validateStringInputWithMaxLength(
        tag,
        "tag",
        constants.stringLimits["tag"]
      );
      if (typeof checked === "undefined") {
        checked = false;
      }
      taskPutData.checked = utils.validateBooleanInput(checked, "checked");

      const updatedTask = await tasksDataFunctions.updateTask(
        taskId,
        taskPutData
      );

      res.json({ userId: userId, taskId: updatedTask._id });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  })

  .delete(async (req, res) => {
    try {
      const taskId = req.params.taskId.trim();
      utils.checkObjectIdString(taskId);
      const removedTask = await tasksDataFunctions.removeTask(taskId);
      res.json(removedTask);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  })
  .get(async (req, res) => {
    try {
      const taskId = req.params.taskId.trim();
      utils.checkObjectIdString(taskId);
      const task = await tasksDataFunctions.getTaskById(taskId);
      res.json(task);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  });

router.route("/:userId/:taskId/:isChecked").put(async (req, res) => {
  try {
    const taskId = req.params.taskId.trim();
    utils.checkObjectIdString(taskId);
    const userId = req.params.userId.trim();
    utils.checkObjectIdString(userId);
    const checked = req.params.isChecked.trim();
    utils.validateBooleanInput(checked, "checked");
    const task = await tasksDataFunctions.getTaskById(taskId);

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
      taskPutData
    );
    res.json({ userId: userId, taskId: updatedTask._id });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
