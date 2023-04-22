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
    filter.tags = await this.getUniqueTagsForAllEvents();
    let data = {
      userId: userId,
      meetings: meetings,
      reminders: reminders,
      tasks: tasks,
      notes: notes,
    };
    if (filter.eventTypeSelected.length !== 0) {
      // filter by event type
      for (let et of filter.eventTypes) {
        if (!filter.eventTypeSelected.includes(et)) {
          data[et] = [];
        }
      }
    }
    if (filter.tagsSelected.length !== 0) {
      // filter by tag
      data.meetings = data.meetings.filter((meeting) => {
        return filter.tagsSelected.includes(meeting.tag);
      });
      data.reminders = data.meetings.filter((reminder) => {
        return filter.tagsSelected.includes(reminder.tag);
      });
      data.tasks = data.meetings.filter((task) => {
        return filter.tagsSelected.includes(task.tag);
      });
      data.notes = data.meetings.filter((note) => {
        return filter.tagsSelected.includes(note.tag);
      });
    }

    // if (filter.eventTypeSelected.length > 0) {
    //   for (let i = 0; i < constants.eventTypes.length; i++) {
    //     if (!constants.eventTypes[i] in data) {
    //       delete data[constants.eventTypes[i]];
    //     } else if (filter.tagsSelected.length > 0) {
    //       data[constants.eventTypes[i]] = data[constants.eventTypes[i]].filter(
    //         (record) => {
    //           return record["tag"] in filter.tagsSelected;
    //         }
    //       );
    //     }
    //   }
    // }
    return data;
  },

  async getUniqueTagsForAllEvents() {
    let meetingsTags = await meetingsDataFunctions.getDistinctTags();
    let reminderTags = await reminderDataFunctions.getDistinctTags();
    let taskTags = await tasksDataFunctions.getDistinctTags();
    let notesTags = await notesDataFunctions.getDistinctTags();
    return meetingsTags.concat(reminderTags).concat(taskTags).concat(notesTags);
  },
};

export default exportedMethods;
