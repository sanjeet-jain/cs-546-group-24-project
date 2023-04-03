import { tasksCollection } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import utils from "../utils/utils.js";
import { usersCollection } from "../config/mongoCollections.js";

const tasksDataFunctions = {
  async getTaskById(id) {
    utils.checkObjectIdString(id);

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
    utils.validateStringInput(title, "title");
    utils.validateStringInput(textBody, "textBody");
    utils.validateDate(dateAddedTo, "dateAddedTo");
    utils.validateDate(dateDueOn, "dateDueOn");
    utils.validatePriority(priority);
    utils.validateStringInput(tag, "tag");

    title = title.trim();
    dateAddedTo = dateAddedTo.trim();
    dateDueOn = dateDueOn.trim();
    textBody = textBody.trim();
    tag = tag.trim();

    const users = await usersCollection();
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw new Error("User not found.");
    }
    const newTask = {
      title: title,
      textBody: textBody,
      dateCreated: new Date(),
      dateAddedTo: new Date(dateAddedTo),
      dateDueOn: new Date(dateDueOn),
      priority: priority,
      tag: tag,
      checked: false,
      type: "task",
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

    const tasks = await tasksCollection();

    const updatedTaskData = {};
    updatedTask.title = updatedTask.title.trim();
    updatedTask.dateAddedTo = updatedTask.dateAddedTo;
    updatedTask.dateDueOn = updatedTask.dateDueOn;
    updatedTask.textBody = updatedTask.textBody.trim();
    updatedTask.tag = updatedTask.tag.trim();
    updatedMeeting.priority = priority;

    if (updatedTask.title) {
      utils.validateStringInput(updatedTask.title, "title");
      updatedTaskData.title = updatedTask.title;
    } else {
      throw new Error("You must provide a title for the task.");
    }

    if (updatedTask.textBody) {
      utils.validateStringInput(updatedTask.textBody, "textBody");
      updatedTaskData.textBody = updatedTask.textBody;
    } else {
      throw new Error("You must provide a textBody for the task.");
    }
    if (updatedTask.dateAddedTo) {
      utils.validateDate(updatedTask.dateAddedTo, "dateAddedTo");
      updatedTaskData.dateAddedTo = new Date(updatedTask.dateAddedTo);
    } else {
      throw new Error("You must provide a dateAddedTo for the task.");
    }

    if (updatedTask.dateDueOn) {
      utils.validateDate(updatedTask.dateDueOn, "dateDueOn");
      updatedTaskData.dateDueOn = new Date(updatedTask.dateDueOn);
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
      utils.validateStringInput(updatedTask.tag, "tag");
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

    const tasks = await tasksCollection();
    const task = await this.getTaskById(id);
    const deletionInfo = await tasks.deleteOne({ _id: ObjectId(id) });
    if (deletionInfo.deletedCount === 0) {
      throw new Error(`Could not delete task with ID ${id}`);
    }

    return task;
  },

  async getAllTasks(userId) {
    utils.checkObjectIdString(userId);
    const users = await usersCollection();
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (user) {
      const tasksIdList = user.taskIds;
      const tasks = await meetingsCollection();
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
