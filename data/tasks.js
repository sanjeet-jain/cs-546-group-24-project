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
   * @param {Date} dateDueOn - The date when the task is due
   * @param {number} priority - The priority of the task (1, 2, or 3)
   * @param {string} tag - The custom tag for the task
   */
  async createTask(
    userId,
    title,
    textBody,
    dateAddedTo,
    dateDueOn,
    priority,
    tag
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
    utils.validateDate(dateDueOn, "dateDueOn");
    utils.validatePriority(priority);
    utils.validateStringInputWithMaxLength(
      tag,
      "tag",
      constants.stringLimits["tag"]
    );
    userId = userId.trim();
    title = title.trim();
    dateAddedTo = dateAddedTo.trim();
    dateDueOn = dateDueOn.trim();
    textBody = textBody.trim();
    tag = tag.trim().toLowerCase();

    const users = await usersCollection();
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw new Error("User not found.");
    }
    const newTask = {
      title: title,
      textBody: textBody,
      dateCreated: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
      dateAddedTo: dayjs(dateAddedTo).format("YYYY-MM-DDTHH:mm:ss"),
      dateDueOn: dayjs(dateDueOn).format("YYYY-MM-DDTHH:mm:ss"),
      priority: priority,
      tag: tag,
      checked: false,
      type: "task",
    };

    const tasks = await tasksCollection();
    const taskExists = await tasks.findOne({ title: title });

    if (taskExists) {
      throw new Error(
        `Task title already exists for the User ${user.first_name}`
      );
    }
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
    const updatedTaskData = {};
    const tasks = await tasksCollection();
    const task = await tasks.findOne({ _id: new ObjectId(id) });
    updatedTaskData.type = task.type;
    updatedTaskData.dateCreated = task.dateCreated;
    updatedTask.title = updatedTask.title.trim();
    updatedTask.textBody = updatedTask.textBody.trim();
    updatedTask.tag = updatedTask.tag.trim().toLowerCase();

    if (updatedTask.title) {
      utils.validateStringInputWithMaxLength(
        updatedTask.title,
        "title",
        constants.stringLimits["title"]
      );
      updatedTaskData.title = updatedTask.title;
    } else {
      throw new Error("You must provide a title for the task.");
    }

    if (updatedTask.textBody) {
      utils.validateStringInputWithMaxLength(
        updatedTask.textBody,
        "textBody",
        constants.stringLimits["textBody"]
      );
      updatedTaskData.textBody = updatedTask.textBody;
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

    if (updatedTask.dateDueOn) {
      utils.validateDate(updatedTask.dateDueOn, "dateDueOn");
      updatedTaskData.dateDueOn = dayjs(updatedTask.dateDueOn).format(
        "YYYY-MM-DDTHH:mm:ss"
      );
    } else {
      throw new Error("You must provide a dateDueOn for the task.");
    }

    if (updatedTask.priority) {
      utils.validatePriority(updatedTask.priority);
      updatedTaskData.priority = updatedTask.priority;
    } else {
      throw new Error("You must provide a priority for the task.");
    }

    if (updatedTask.tag) {
      utils.validateStringInputWithMaxLength(
        updatedTask.tag,
        "tag",
        constants.stringLimits["tag"]
      );
      updatedTaskData.tag = updatedTask.tag;
    } else {
      throw new Error("You must provide a tag for the task.");
    }

    if (typeof updatedTask.checked !== "undefined") {
      utils.validateBooleanInput(updatedTask.checked, "checked");
      updatedTaskData.checked = updatedTask.checked;
    } else {
      throw new Error("You must provide a checked value for the task.");
    }
    const updateInfo = await tasks.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedTaskData }
    );
    if (updateInfo.modifiedCount === 0) {
      throw new Error("Could not update task successfully");
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
};

export default tasksDataFunctions;
