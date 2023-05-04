import { Router } from "express";
import tasksDataFunctions from "../data/tasks.js";
import utils from "../utils/utils.js";
import constants from "../constants/constants.js";
import dayjs from "dayjs";
const router = Router();

router
  .route("/tasks/:userId")
  .get(utils.validateUserId, async (req, res) => {
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
  .post(utils.validateUserId, async (req, res) => {
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
        taskPutData,
        userId
      );

      res.json({ userId: userId, taskId: updatedTask._id });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  })

  .delete(utils.validateUserId, async (req, res) => {
    try {
      utils.checkObjectIdString(req.params.userId);
      const userId = req.params.userId.trim();
      utils.checkObjectIdString(req.params.taskId);
      const taskId = req.params.taskId.trim();
      const removedTask = await tasksDataFunctions.removeTask(taskId, userId);
      res.json(removedTask);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  })
  .get(utils.validateUserId, async (req, res) => {
    try {
      utils.checkObjectIdString(req.params.userId);
      const userId = req.params.userId.trim();
      utils.checkObjectIdString(req.params.taskId);
      const taskId = req.params.taskId.trim();
      const task = await tasksDataFunctions.getTaskById(taskId, userId);
      res.json(task);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  });

router
  .route("/:userId/:taskId/dateAddedTo")
  .put(utils.validateUserId, async (req, res) => {
    try {
      utils.checkObjectIdString(req.params.userId);
      const userId = req.params.userId.trim();
      utils.checkObjectIdString(req.params.taskId);
      const taskId = req.params.taskId.trim();
      const taskPutData = await tasksDataFunctions.getTaskById(taskId, userId);

      taskPutData.dateAddedTo = dayjs(req?.body?.dateAddedTo).format(
        "YYYY-MM-DDTHH:mm"
      );
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
        taskPutData,
        userId
      );

      res.json({ userId: userId, taskId: updatedTask._id });
    } catch (e) {
      res.status(400).json({ error: e.message });
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
    const task = await tasksDataFunctions.getTaskById(taskId, userId);

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
