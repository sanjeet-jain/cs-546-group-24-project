import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import meetingsDataFunctions from "../data/meetings.js";
import usersDataFunctions from "../data/users.js";
import notesDataFunctions from "../data/notes.js";

export async function runSetup() {
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
  let dt = new Date();

  const sampleUser = {
    first_name: "Sample",
    last_name: "User",
    email: "sampleuser@gmail.com",
    // password will be hashed when being passed from UI to the API and then stored ( done by Jonathan)
    password: "abcDefgh2i",
    disability: false,
    // date string passed here is MM/DD/YYYY
    dob: new Date("01/01/1996").toDateString(),
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

  // ideally use the CRUD functions in data/ to initialise and seed all the data we have !

  // Seed Meetings
  const sampleMeeting = {
    title: "Weekly Team Meeting",
    dateCreated: dt.toString(),
    dateAddedTo: dt.toString(),
    dateDueOn: new Date(
      new Date().setHours(new Date().getHours() + 1)
    ).toString(),
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
  const sampleMeeting2 = {
    title: "Weekly Team Meeting",
    dateCreated: dt.toString(),
    dateAddedTo: dt.toString(),
    dateDueOn: new Date(
      new Date().setHours(new Date().getHours() + 1)
    ).toString(),
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

  // Seed tasks

  // Seed reminders

  // Seed notes
  const sampleNote = {
    title: "sample note",
    dateAddedTo: sampleMeeting.dateAddedTo,
    textBody: "     sample Note body      ",
    tag: "cs 546",
    documentLinks: [],
    dateCreated: dt.toString(),
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
  console.log("newly created user: ", user._id.toString());
  const updatedUser = await usersDataFunctions.getUser(user._id.toString());
  console.log(updatedUser);
  console.log("seeding done!");
}

export async function seed() {
  const db = await dbConnection();
  await db.dropDatabase();
  await runSetup();
  await closeConnection();
}
