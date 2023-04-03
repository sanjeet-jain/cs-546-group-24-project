import { Router } from "express";
import tasksDataFunctions from "../data/tasks.js";
import utils from "../utils/utils.js";

const router = Router();

router
  .route("/tasks/:userId")
  .get(async (req, res) => {
    try {
      const userId = req.params.userId.trim();
      utils.checkObjectIdString(userId);
      const tasks = await tasksDataFunctions.getAllTasks(userId);
      res.json(tasks);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  })
  .post(async (req, res) => {
    try {
      const userId = req.params.userId.trim();
      utils.checkObjectIdString(userId);
      const { title, textBody, dateAddedTo, dateDueOn, priority, tag } =
        req.body;
      utils.checkObjectIdString(userId);
      utils.validateStringInput(title, "title");
      utils.validateStringInput(textBody, "textBody");
      utils.validateDate(dateAddedTo, "dateAddedTo");
      utils.validateDate(dateDueOn, "dateDueOn");
      utils.validatePriority(priority);
      utils.validateStringInput(tag, "tag");
      const newTask = await tasksDataFunctions.createTask(
        userId,
        title,
        textBody,
        dateAddedTo,
        dateDueOn,
        priority,
        tag
      );
      res.status(201).json(newTask);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

router
  .route("/:taskId")
  .get(async (req, res) => {
    try {
      const taskId = req.params.taskId.trim();
      utils.checkObjectIdString(taskId);
      const task = await tasksDataFunctions.getTaskById(taskId);
      res.json(task);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  })

  .put(async (req, res) => {
    try {
      const taskId = req.params.taskId.trim();
      utils.checkObjectIdString(taskId);
      const taskPutData = req.body;
      const { title, textBody, dateAddedTo, dateDueOn, priority, tag } =
        taskPutData;
      if (!taskPutData || Object.keys(taskPutData).length === 0) {
        return res
          .status(400)
          .json({ error: "There are no fields in the request body" });
      }
      utils.validateStringInput(title, "title");
      utils.validateStringInput(textBody, "textBody");
      utils.validateDate(dateAddedTo, "dateAddedTo");
      utils.validateDate(dateDueOn, "dateDueOn");
      utils.validatePriority(priority);
      utils.validateStringInput(tag, "tag");

      const updatedTask = await tasksDataFunctions.updateTask(
        taskId,
        taskPutData
      );

      res.json(updatedTask);
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
  });

export default router;
