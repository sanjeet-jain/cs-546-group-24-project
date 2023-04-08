import meetingsDataFunctions from "./meetings.js";
import * as reminderDataFunctions from "./reminder.js";
import tasksDataFunctions from "./tasks.js";
import notesDataFunctions from "./notes.js";

const exportedMethods = {
  async getAllEvents(userId) {
    const meeetings = await meetingsDataFunctions.getAll(userId);
    const reminders = await reminderDataFunctions.getAllReminders(userId);
    const tasks = await tasksDataFunctions.getAllTasks(userId);
    const notes = await notesDataFunctions.getAll(userId);
    return {
      userId: userId,
      meeetings: meeetings,
      reminders: reminders,
      tasks: tasks,
      notes: notes,
    };
  },
};

export default exportedMethods;
