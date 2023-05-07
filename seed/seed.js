import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import meetingsDataFunctions from "../data/meetings.js";
import tasksDataFunctions from "../data/tasks.js";
import usersDataFunctions from "../data/users.js";
import notesDataFunctions from "../data/notes.js";
import * as reminderDataFunctions from "../data/reminder.js";
import dayjs from "dayjs";
let j = 0;
async function createUser(email) {
  const sampleUser = {
    first_name: "Sample",
    last_name: "User",
    email: email,
    // password will be hashed when being passed from UI to the API and then stored ( done by Jonathan)
    password: "abcDefgh2i!",
    disability: false,
    // date string passed here is MM/DD/YYYY
    dob: "1996-01-01",
    consent: true,
    //initially an empty array
    // taskIds: [],
    // reminderIds: [],
    // noteIds: [],
    // meetingIds: [],
  };

  const user = await usersDataFunctions.create(
    sampleUser.first_name,
    sampleUser.last_name,
    sampleUser.email,
    sampleUser.password,
    sampleUser.disability,
    sampleUser.dob,
    sampleUser.consent
  );
  return user;
}
export async function runSetup(datestring, user) {
  /*
  UsersCollection
 _id: ObjectId,
 first_name: String,
 last_name: String,
 email: String,
 password: String,
 Disability:boolean,
 Dob:date,
 Consent:boolean
 taskIds: [ObjectId],
 reminderIds: [ObjectId],
 noteIds: [ObjectId],
 meetingIds: [ObjectId]
*/

  let dt = dayjs(datestring).set("hours", 14).toDate();

  // ideally use the CRUD functions in data/ to initialise and seed all the data we have !

  // Seed Meetings
  const sampleMeeting = {
    title: "Weekly Team Meeting repeating",
    dateCreated: dayjs(dt).format("YYYY-MM-DDTHH:mm"),
    dateAddedTo: dayjs(dt).format("YYYY-MM-DDTHH:mm"),
    dateDueOn: dayjs(dt).add(1, "hour").format("YYYY-MM-DDTHH:mm"),
    priority: 2,
    textBody: "Agenda items: 1. Project updates, 2. Client feedback",
    tag: "team",
    repeating: true,
    repeatingCounterIncrement: 2,
    repeatingIncrementBy: "day",
    repeatingGroup: null,
    expired: false,
    type: "meeting",
  };

  await meetingsDataFunctions.create(
    user._id.toString(),
    sampleMeeting.title,
    sampleMeeting.dateAddedTo,
    sampleMeeting.dateDueOn,
    sampleMeeting.priority,
    sampleMeeting.textBody,
    sampleMeeting.tag,
    sampleMeeting.repeating,
    sampleMeeting.repeatingCounterIncrement,
    sampleMeeting.repeatingIncrementBy
  );
  const sampleMeeting2 = {
    title: "Weekly Team Meeting non repeating",
    dateCreated: dayjs(dt).format("YYYY-MM-DDTHH:mm"),
    dateAddedTo: dayjs(dt).format("YYYY-MM-DDTHH:mm"),
    dateDueOn: dayjs(dt).add(1, "hour").format("YYYY-MM-DDTHH:mm"),
    priority: 2,
    textBody: "Agenda items: 1. Project updates, 2. Client feedback",
    tag: "team",
    repeating: false,
    repeatingCounterIncrement: 0,
    repeatingIncrementBy: "",
    repeatingGroup: null,
    expired: false,
    type: "meeting",
  };
  await meetingsDataFunctions.create(
    user._id.toString(),
    sampleMeeting2.title,
    sampleMeeting2.dateAddedTo,
    sampleMeeting2.dateDueOn,
    sampleMeeting2.priority,
    sampleMeeting2.textBody,
    sampleMeeting2.tag,
    sampleMeeting2.repeating,
    sampleMeeting2.repeatingCounterIncrement,
    sampleMeeting2.repeatingIncrementBy
  );

  for (let i = 0; i < 10; i++) {
    await meetingsDataFunctions.create(
      user._id.toString(),
      sampleMeeting2.title + " " + j.toString(),
      sampleMeeting2.dateAddedTo,
      sampleMeeting2.dateDueOn,
      sampleMeeting2.priority,
      sampleMeeting2.textBody,
      sampleMeeting2.tag,
      sampleMeeting2.repeating,
      sampleMeeting2.repeatingCounterIncrement,
      sampleMeeting2.repeatingIncrementBy
    );
    j += 1;
  }

  // Seed tasks

  const sampleTask = {
    title: "Finish project report",
    textBody:
      "Complete the final report for the project and submit it to the manager.",
    dateCreated: dayjs(dt).format("YYYY-MM-DDTHH:mm"),
    dateAddedTo: dayjs(dt).format("YYYY-MM-DDTHH:mm"),
    priority: 1,
    tag: "work",
    checked: false,
    type: "task",
  };

  await tasksDataFunctions.createTask(
    user._id.toString(),
    sampleTask.title,
    sampleTask.textBody,
    sampleTask.dateAddedTo,
    sampleTask.priority,
    sampleTask.tag,
    sampleTask.checked
  );
  const sampleTask2 = {
    title: "Buy groceries",
    textBody: "Buy milk, eggs, bread, and fruits from the supermarket.",
    dateCreated: dayjs(dt).format("YYYY-MM-DDTHH:mm"),
    dateAddedTo: dayjs(dt).format("YYYY-MM-DDTHH:mm"),
    priority: 3,
    tag: "personal",
    checked: false,
    type: "task",
  };

  await tasksDataFunctions.createTask(
    user._id.toString(),
    sampleTask2.title,
    sampleTask2.textBody,
    sampleTask2.dateAddedTo,
    sampleTask2.priority,
    sampleTask2.tag,
    sampleTask2.checked
  );

  for (let i = 0; i < 10; i++) {
    await tasksDataFunctions.createTask(
      user._id.toString(),
      sampleTask2.title + " " + j.toString(),
      sampleTask2.textBody,
      sampleTask2.dateAddedTo,
      sampleTask2.priority,
      sampleTask2.tag,
      sampleTask2.checked
    );
    j += 1;
  }

  // Seed reminders
  const sampleReminder = {
    title: "reminder title",
    textBody: "important reminder",
    priority: 3,
    tag: "rem",
    repeating: false,
    dateAddedTo: dayjs(dt).format("YYYY-MM-DDTHH:mm"),
    endDateTime: null,
    repeatingIncrementBy: null,
    type: "reminder",
  };

  const insertedReminder = await reminderDataFunctions.createReminder(
    user._id.toString(),
    sampleReminder.title,
    sampleReminder.textBody,
    sampleReminder.priority,
    sampleReminder.tag,
    sampleReminder.repeating,
    sampleReminder.endDateTime,
    sampleReminder.repeatingIncrementBy,
    sampleReminder.dateAddedTo
  );

  // Seed notes
  const sampleNote = {
    title: "sample note",
    dateAddedTo: sampleMeeting.dateAddedTo,
    textBody: "     sample Note body      ",
    tag: "cs",
    documentLinks: [],
    dateCreated: dayjs(dt).format("YYYY-MM-DDTHH:mm"),
    type: "notes",
  };
  await notesDataFunctions.create(
    user._id.toString(),
    sampleNote.title,
    sampleNote.dateAddedTo,
    sampleNote.textBody,
    sampleNote.tag,
    sampleNote.documentLinks
  );

  if (datestring) {
    const sampleMeeting2 = {
      title: "Weekly Team Meeting non repeating",
      dateCreated: dayjs(dt).format("YYYY-MM-DDTHH:mm"),
      dateAddedTo: null,
      dateDueOn: null,
      priority: 2,
      textBody: "Agenda items: 1. Project updates, 2. Client feedback",
      tag: "team",
      repeating: false,
      repeatingCounterIncrement: 0,
      repeatingIncrementBy: "",
      repeatingGroup: null,
      expired: false,
      type: "meeting",
    };
    await meetingsDataFunctions.create(
      user._id.toString(),
      sampleMeeting2.title,
      sampleMeeting2.dateAddedTo,
      sampleMeeting2.dateDueOn,
      sampleMeeting2.priority,
      sampleMeeting2.textBody,
      sampleMeeting2.tag,
      sampleMeeting2.repeating,
      sampleMeeting2.repeatingCounterIncrement,
      sampleMeeting2.repeatingIncrementBy
    );
    // TODO use when you want to check right pane scrollability
    for (let i = 0; i < 10; i++) {
      await meetingsDataFunctions.create(
        user._id.toString(),
        sampleMeeting2.title + " " + j.toString(),
        sampleMeeting2.dateAddedTo,
        sampleMeeting2.dateDueOn,
        sampleMeeting2.priority,
        sampleMeeting2.textBody,
        sampleMeeting2.tag,
        sampleMeeting2.repeating,
        sampleMeeting2.repeatingCounterIncrement,
        sampleMeeting2.repeatingIncrementBy
      );
      j += 1;
    }

    const sampleTask2 = {
      title: "Buy groceries",
      textBody: "Buy milk, eggs, bread, and fruits from the supermarket.",
      dateCreated: null,
      dateAddedTo: null,
      priority: 3,
      tag: "personal",
      checked: false,
      type: "task",
    };

    await tasksDataFunctions.createTask(
      user._id.toString(),
      sampleTask2.title,
      sampleTask2.textBody,
      sampleTask2.dateAddedTo,
      sampleTask2.priority,
      sampleTask2.tag,
      sampleTask2.checked
    );
    // TODO use when you want to check right pane scrollability
    for (let i = 0; i < 10; i++) {
      await tasksDataFunctions.createTask(
        user._id.toString(),
        sampleTask2.title + " " + j.toString(),
        sampleTask2.textBody,
        sampleTask2.dateAddedTo,
        sampleTask2.priority,
        sampleTask2.tag,
        sampleTask2.checked
      );
      j += 1;
    }
  }

  const updatedUser = await usersDataFunctions.getUser(user._id.toString());
  console.log(updatedUser);
  console.log("newly created user: ", user._id.toString());
  console.log("seeding done!");
}

export async function seed() {
  const db = await dbConnection();
  await db.dropDatabase();
  const user = await createUser("sampleuser@gmail.com");
  await runSetup("2023-04-22", user);
  await runSetup(undefined, user);
  const user2 = await createUser("sampleuser2@gmail.com");
  await runSetup("2023-04-22", user2);
  await runSetup(undefined, user2);
  await closeConnection();
}
