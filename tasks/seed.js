import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import ObjectId from "mongodb";
import { usersCollection } from "../config/mongoCollections.js";
import { meetingsCollection } from "../config/mongoCollections.js";
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

  const sampleMeeting = {
    title: "Weekly Team Meeting",
    dateCreated: dt,
    dateAddedTo: dt,
    dateDueOn: new Date(new Date().setHours(new Date().getHours() + 1)),
    priority: 2,
    textBody: "Agenda items: 1. Project updates, 2. Client feedback",
    tag: "team",
    repeating: false,
    repeatingCounterIncrement: 0,
    repeatingIncrementBy: "",
    repeatingGroup: null,
    expired: false,
  };
  const meetings = await meetingsCollection();
  let insertInfo = await meetings.insertOne(sampleMeeting);

  const sampleUser = {
    first_name: "Sample",
    last_name: "User",
    email: "sampleUser@gmail.com",
    // password will be hashed when being passed from UI to the API and then stored ( done by Jonathan)
    password: "sampleUser",
    disability: false,
    // date string passed here is MM/DD/YYYY
    dob: new Date("01/01/1996"),
    consent: true,
    //initially an empty array
    taskIds: [],
    reminderIds: [],
    noteIds: [],
    meetingIds: [insertInfo.insertedId],
  };

  // need to call the data/create function for users here
  // for now inserting it directly
  const users = await usersCollection();
  insertInfo = await users.insertOne(sampleUser);
  console.log(insertInfo);
  console.log("seeding done!");

  // ideally use the CRUD functions in data/ to initialise and seed all the data we have !
}

export async function seed() {
  const db = await dbConnection();
  await db.dropDatabase();
  await runSetup();
  await closeConnection();
}
