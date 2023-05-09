import dayjs from "dayjs";
import {
  tasksCollection,
  usersCollection,
} from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import utils from "../utils/utils.js";
import constants from "../constants/constants.js";

const tasksDataFunctions = {
  async getTaskById(id, userId) {
    utils.checkObjectIdString(id);
    id = id.trim();
    utils.checkObjectIdString(userId);
    userId = userId.trim();
    const users = await usersCollection();
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (
      !user.taskIds.find((x) => {
        return x.toString() === id;
      })
    ) {
      throw new Error("Task not found");
    }
    const tasks = await tasksCollection();
    const task = await tasks.findOne({ _id: new ObjectId(id) });

    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }

    return task;
  },
  /**
   * @param {string} userId - The user ID to which the task is associated
   * @param {string} title - The title of the task
   * @param {string} textBody - The body text of the task
   * @param {Date} dateAddedTo - The date when the task was added to the collection
   * @param {number} priority - The priority of the task (1, 2, or 3)
   * @param {string} tag - The custom tag for the task
   * @param {boolean} checked - Whether the task is checked off or not
   * @returns {Object} The newly created task
   */
  async createTask(
    userId,
    title,
    textBody,
    dateAddedTo,
    priority,
    tag,
    checked
  ) {
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
      textBody = textBody.trim();
    } else {
      textBody = null;
    }

    if (typeof dateAddedTo === "string" && dateAddedTo.trim().length > 0) {
      utils.validateDate(dateAddedTo, "dateAddedTo");
      dateAddedTo = dayjs(dateAddedTo.trim()).format("YYYY-MM-DDTHH:mm");
      dateAddedTo = dateAddedTo.trim();
    } else {
      dateAddedTo = null;
    }

    utils.validatePriority(priority);

    utils.validateStringInputWithMaxLength(
      tag,
      "tag",
      constants.stringLimits["tag"]
    );

    userId = userId.trim();
    title = title.trim();

    tag = tag.trim().toLowerCase();

    if (typeof checked === "undefined" || checked === false) {
      checked = false;
    } else {
      checked = true;
    }
    let expired = utils.validateBooleanInput(checked, "checked");

    const users = await usersCollection();
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw new Error("User not found.");
    }
    const newTask = {
      title: title,
      textBody: textBody,
      dateCreated: dayjs().format("YYYY-MM-DDTHH:mm"),
      dateAddedTo: dateAddedTo,
      priority: priority,
      tag: tag,
      checked: checked,
      type: "task",
      expired: expired,
    };

    let taskEvents = await this.getAllTasks(userId);
    for (let i = 0; i < taskEvents.length; i++) {
      this.isTwoTaskEventsSame(taskEvents[i], newTask);
    }

    const tasks = await tasksCollection();
    const insertInfo = await tasks.insertOne(newTask);

    if (insertInfo.insertedCount === 0) {
      throw new Error("Could not add task");
    }

    const newId = insertInfo.insertedId;
    await users.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { taskIds: newId } }
    );
    return await this.getTaskById(newId.toString(), userId);
  },

  async updateTask(id, updatedTask, userId) {
    utils.checkObjectIdString(id);
    id = id.trim();
    utils.checkObjectIdString(userId);
    userId = userId.trim();
    const users = await usersCollection();
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (
      !user.taskIds.find((x) => {
        return x.toString() === id;
      })
    ) {
      throw new Error("Task not found");
    }
    let updatedTaskData = {};
    const tasks = await tasksCollection();
    const task = await tasks.findOne({ _id: new ObjectId(id) });
    updatedTaskData = { ...task };

    if (
      typeof updatedTask.checked === "undefined" ||
      updatedTask.checked === false
    ) {
      updatedTask.checked = false;
    } else {
      updatedTask.checked = true;
    }

    updatedTaskData.checked = utils.validateBooleanInput(
      updatedTask.checked,
      "checked"
    );

    updatedTaskData.expired = updatedTask.checked;

    utils.validateStringInputWithMaxLength(
      updatedTask.title,
      "title",
      constants.stringLimits["title"]
    );
    updatedTaskData.title = updatedTask.title.trim();

    if (
      typeof updatedTask.textBody === "string" &&
      updatedTask.textBody.trim().length > 0
    ) {
      utils.validateStringInputWithMaxLength(
        updatedTask.textBody,
        "textBody",
        constants.stringLimits["textBody"]
      );
      updatedTaskData.textBody = updatedTask.textBody.trim();
    } else {
      updatedTaskData.textBody = null;
    }

    if (
      typeof updatedTask.dateAddedTo === "string" &&
      updatedTask.dateAddedTo.trim().length > 0
    ) {
      utils.validateDate(updatedTask.dateAddedTo, "dateAddedTo");
      updatedTaskData.dateAddedTo = dayjs(updatedTask.dateAddedTo).format(
        "YYYY-MM-DDTHH:mm"
      );
    } else {
      updatedTaskData.dateAddedTo = null;
    }

    if (updatedTask.priority) {
      updatedTaskData.priority = utils.validatePriority(updatedTask.priority);
    } else {
      throw new Error("You must provide a priority for the task.");
    }

    if (
      typeof updatedTask.tag === "string" &&
      updatedTask.tag.trim().length > 0
    ) {
      utils.validateStringInputWithMaxLength(
        updatedTask.tag,
        "tag",
        constants.stringLimits["tag"]
      );
      updatedTaskData.tag = updatedTask.tag.trim().toLowerCase();
    } else {
      updatedTaskData.tag = "tasks";
    }
    if (updatedTask.checked === true) {
      updatedTask.onTime = this.isTaskOnTime(updatedTask.dateAddedTo);
    }
    //dont allow task to be checked if no date assigned
    if (updatedTaskData.checked && updatedTaskData.dateAddedTo == null) {
      throw new Error("Add a date to mark this task completed");
    }
    //Added this to pre check if there are any changes made to the task without making unnecessary DB call
    if (
      updatedTaskData.title === task.title &&
      updatedTaskData.textBody === task.textBody &&
      updatedTaskData.dateAddedTo === task.dateAddedTo &&
      updatedTaskData.priority === task.priority &&
      updatedTaskData.tag === task.tag &&
      updatedTaskData.checked === task.checked
    ) {
      throw new Error("No Changes Made to the Task.");
    }
    const updateInfo = await tasks.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedTaskData }
    );
    if (updateInfo.modifiedCount === 0) {
      throw new Error("No Changes Made to the Task.");
    }
    if (updateInfo.matchedCount === 0) {
      throw new Error("No Task Found to Update.");
    }
    if (updateInfo.acknowledged !== true) {
      throw new Error("Update wasn't successful.");
    }

    return await this.getTaskById(id, userId);
  },

  async removeTask(id, userId) {
    utils.checkObjectIdString(id);
    id = id.trim();
    utils.checkObjectIdString(userId);
    userId = userId.trim();
    const users = await usersCollection();
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (
      !user.taskIds.find((x) => {
        return x.toString() === id;
      })
    ) {
      throw new Error("Task not found");
    }
    const task = await tasksCollection();
    const deletionInfo = await task.findOneAndDelete({ _id: new ObjectId(id) });
    if (deletionInfo.lastErrorObject.n === 0) {
      throw new Error(`Could not delete task with ID ${id}`);
    }

    //update the userCollection by removing the same id from the taskIds array in user collection
    await users.updateOne(
      { taskIds: new ObjectId(id) },
      { $pull: { taskIds: new ObjectId(id) } }
    );
    return `${deletionInfo.value.title} has been successfully deleted!`;
  },

  async getAllTasks(userId) {
    utils.checkObjectIdString(userId);
    userId = userId.trim();
    const users = await usersCollection();
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (user) {
      const tasksIdList = user.taskIds;
      const tasks = await tasksCollection();
      const allTasks = await tasks
        .find({ _id: { $in: tasksIdList } })
        .toArray();
      return allTasks;
    } else {
      throw new Error("user not found");
    }
  },

  async getDistinctTags() {
    const tasks = await tasksCollection();
    return tasks.distinct("tag");
  },

  isTwoTaskEventsSame(task1, task2) {
    let keys = [
      "title",
      "textBody",
      "priority",
      "tag",
      "dateAddedTo",
      "checked",
    ];
    let flag = true;
    for (let i = 0; i < keys.length; i++) {
      if (!(task1[keys[i]] === task2[keys[i]])) {
        flag = false;
      }
    }
    if (flag) {
      throw new Error("Trying to update same event value");
    }
  },
  isTaskOnTime(dayAddedTo) {
    if (
      (dayjs(dayAddedTo).year() === dayjs().year() &&
        dayjs(dayAddedTo).month() === dayjs().month() &&
        dayjs(dayAddedTo).date() === dayjs().date()) ||
      dayjs(dayAddedTo).diff(dayjs()) > 0
    ) {
      return true;
    }
    return false;
  },
};

export default tasksDataFunctions;
