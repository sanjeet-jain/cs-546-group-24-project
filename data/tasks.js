import dayjs from "dayjs";
import {
  tasksCollection,
  usersCollection,
} from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import utils from "../utils/utils.js";
import constants from "../constants/constants.js";

const tasksDataFunctions = {
  async getTaskById(id) {
    utils.checkObjectIdString(id);
    id = id.trim();
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

    userId = userId.trim();
    title = title.trim();
    dateAddedTo = dateAddedTo.trim();
    textBody = textBody.trim();
    tag = tag.trim().toLowerCase();

    if (typeof checked === "undefined") {
      checked = false;
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
      dateAddedTo: dayjs(dateAddedTo).format("YYYY-MM-DDTHH:mm"),
      priority: priority,
      tag: tag,
      checked: checked,
      type: "task",
      expired: expired,
    };

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
    return await this.getTaskById(newId.toString());
  },

  async updateTask(id, updatedTask) {
    utils.checkObjectIdString(id);
    let updatedTaskData = {};
    const tasks = await tasksCollection();
    const task = await tasks.findOne({ _id: new ObjectId(id) });
    updatedTaskData = { ...task };

    if (typeof updatedTask.checked === "undefined") {
      updatedTaskData.checked = false;
    }
    updatedTaskData.checked = utils.validateBooleanInput(
      updatedTask.checked,
      "checked"
    );
    updatedTaskData.expired = updatedTaskData.checked;
    if (updatedTask.title) {
      utils.validateStringInputWithMaxLength(
        updatedTask.title,
        "title",
        constants.stringLimits["title"]
      );
      updatedTaskData.title = updatedTask.title.trim();
    } else {
      throw new Error("You must provide a title for the task.");
    }

    if (updatedTask.textBody) {
      utils.validateStringInputWithMaxLength(
        updatedTask.textBody,
        "textBody",
        constants.stringLimits["textBody"]
      );
      updatedTaskData.textBody = updatedTask.textBody.trim();
    } else {
      throw new Error("You must provide a textBody for the task.");
    }
    if (updatedTask.dateAddedTo) {
      utils.validateDate(updatedTask.dateAddedTo, "dateAddedTo");
      updatedTaskData.dateAddedTo = dayjs(updatedTask.dateAddedTo).format(
        "YYYY-MM-DDTHH:mm:ss"
      );
    } else {
      throw new Error("You must provide a dateAddedTo for the task.");
    }

    if (updatedTask.priority) {
      updatedTaskData.priority = utils.validatePriority(updatedTask.priority);
    } else {
      throw new Error("You must provide a priority for the task.");
    }

    if (updatedTask.tag) {
      utils.validateStringInputWithMaxLength(
        updatedTask.tag,
        "tag",
        constants.stringLimits["tag"]
      );
      updatedTaskData.tag = updatedTask.tag.trim().toLowerCase();
    } else {
      throw new Error("You must provide a tag for the task.");
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

    return await this.getTaskById(id);
  },

  async removeTask(id) {
    utils.checkObjectIdString(id);
    id = id.trim();
    const task = await tasksCollection();
    const deletionInfo = await task.findOneAndDelete({ _id: new ObjectId(id) });
    if (deletionInfo.lastErrorObject.n === 0) {
      throw new Error(`Could not delete task with ID ${id}`);
    }

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
};

export default tasksDataFunctions;
