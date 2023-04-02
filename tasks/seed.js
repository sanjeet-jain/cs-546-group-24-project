import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import ObjectId from "mongodb";
import { usersCollection } from "../config/mongoCollections.js";
import { meetingsCollection } from "../config/mongoCollections.js";
import meetingsDataFunctions from "../data/meetings.js";
import bcrypt from "bcrypt";

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
  const hashPW = await bcrypt.hash("abcDefgh2i",16);
  const sampleUser = {
    first_name: "Sample",
    last_name: "User",
    email: "sampleUser@gmail.com",
    // password will be hashed when being passed from UI to the API and then stored ( done by Jonathan)
    password: hashPW,
    disability: false,
    // date string passed here is MM/DD/YYYY
    dob: new Date("01/01/1996"),
    consent: true,
    //initially an empty array
    taskIds: [],
    reminderIds: [],
    noteIds: [],
    meetingIds: [],
  };

  // need to call the data/create function for users here
  // for now inserting it directly
  const users = await usersCollection();
  const insertInfo = await users.insertOne(sampleUser);
  console.log(insertInfo);

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
    insertInfo.insertedId.toString(),
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
    insertInfo.insertedId.toString(),
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

  console.log("seeding done!");
}

export async function seed() {
  const db = await dbConnection();
  await db.dropDatabase();
  await runSetup();
  await closeConnection();
}
