import meetingsDataFunctions from "./meetings.js";
import * as reminderDataFunctions from "./reminder.js";
import tasksDataFunctions from "./tasks.js";
import notesDataFunctions from "./notes.js";
import constants from "./../constants/constants.js";

const exportedMethods = {
  async getAllEvents(userId, filter) {
    const meetings = await meetingsDataFunctions.getAll(userId);
    const reminders = await reminderDataFunctions.getAllReminders(userId);
    const tasks = await tasksDataFunctions.getAllTasks(userId);
    const notes = await notesDataFunctions.getAll(userId);

    let data = {
      userId: userId,
      meetings: meetings,
      reminders: reminders,
      tasks: tasks,
      notes: notes,
    };

    let tagsToRender = [];
    for (let i = 0; i < constants.eventTypes.length; i++) {
      if (
        !(filter.eventTypeSelected.length === 0) &&
        !filter.eventTypeSelected.includes(constants.eventTypes[i])
      ) {
        delete data[constants.eventTypes[i]];
      } else {
        tagsToRender = tagsToRender.concat(
          await this.getUniqueTagsForEvents(constants.eventTypes[i])
        );
        if (filter.tagsSelected.length > 0) {
          data[constants.eventTypes[i]] = data[constants.eventTypes[i]].filter(
            (record) => {
              return filter.tagsSelected.includes(record.tag);
            }
          );
        }
      }
    }
    filter.tags = tagsToRender;
    return data;
  },

  async getUniqueTagsForEvents(eventTypeStr) {
    let obj = [];
    if (eventTypeStr === "reminders") {
      obj = await reminderDataFunctions.getDistinctTags();
    } else if (eventTypeStr === "meetings") {
      obj = await meetingsDataFunctions.getDistinctTags();
    } else if (eventTypeStr === "notes") {
      obj = await notesDataFunctions.getDistinctTags();
    } else if (eventTypeStr === "tasks") {
      obj = await tasksDataFunctions.getDistinctTags();
    }
    return obj;
  },
};

export default exportedMethods;
