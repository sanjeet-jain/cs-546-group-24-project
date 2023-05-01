import { usersCollection } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import utils from "../utils/utils.js";
import bcrypt from "bcrypt";
import constants from "../constants/constants.js";
import tasksDataFunctions from "./tasks.js";
import * as remindersDataFunctions from "./reminder.js";
import notesDataFunctions from "./notes.js";
import meetingsDataFunctions from "./meetings.js";
/*
  UsersCollection {
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
  }
*/

const exportedMethods = {
  async create(
    first_name,
    last_name,
    email,
    password,
    disability,
    dob,
    consent
  ) {
    //field validation
    utils.validateName(first_name, "First name");
    utils.validateName(last_name, "Last name");
    utils.validateEmail(email, "Email");
    utils.validatePassword(password, "Password");
    if (disability) {
      utils.validateBooleanInput(disability, "Disability");
    }
    utils.validateDate(dob, "D.O.B");
    utils.validateBooleanInput(consent, "Consent");

    const users = await usersCollection();

    //checking if email is registered
    email = email.trim();
    email = email.toLowerCase();
    const exist_email = await users.findOne({ email: email });
    if (exist_email) throw Error(`Already a user registered with that email`);

    //password hashing
    password = password.trim();
    const hashPW = await bcrypt.hash(password, constants.pwRounds);

    const newUser = {
      _id: new ObjectId(),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email,
      password: hashPW,
      disability: disability === "true" ? true : false,
      dob: dob,
      consent: consent === "true" ? true : false,
      taskIds: [],
      reminderIds: [],
      noteIds: [],
      meetingIds: [],
    };
    const insertUser = await users.insertOne(newUser);
    const user = this.getUser(newUser._id.toString());
    if (insertUser.insertedCount === 0) {
      throw Error(`insertion of user failed`);
    }
    return user;
  },
  async getUser(id) {
    if (!id) throw Error(`No id supplied`);
    utils.checkObjectIdString(id);
    id = id.trim();
    const users = await usersCollection();

    const user = await users.findOne({ _id: new ObjectId(id) });
    return user;
  },
  async updateUser(id, { first_name, last_name, disability, dob }) {
    utils.checkObjectIdString(id);
    utils.validateName(first_name, "First name");
    utils.validateName(last_name, "Last name");
    if (disability) {
      utils.validateBooleanInput(disability, "Disability");
    }

    utils.validateDate(dob, "D.O.B");
    id = id.trim();
    first_name = first_name.trim();
    last_name = last_name.trim();
    dob = dob.trim();
    const users = await usersCollection();
    const currUser = await this.getUser(id);

    let updatedUser = {
      first_name: first_name,
      last_name: last_name,
      email: currUser.email,
      password: currUser.password,
      disability: disability,
      dob: dob,
      consent: currUser.consent,
      taskIds: currUser.taskIds,
      reminderIds: currUser.reminderIds,
      noteIds: currUser.noteIds,
      meetingIds: currUser.meetingIds,
    };
    const updateInfo = await users.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedUser }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
      throw Error("Update failed");
    } else {
      return updatedUser;
    }
  },

  async changePassword(id, oldPassword, newPassword, reEnterNewPassword) {
    try {
      utils.checkObjectIdString(id);

      utils.validateStringInput(oldPassword);
      utils.validateStringInput(reEnterNewPassword);
    } catch (e) {
      throw new Error(e);
    }

    oldPassword = oldPassword.trim();
    newPassword = newPassword.trim();
    reEnterNewPassword = reEnterNewPassword.trim();

    id = id.trim();
    let users = await usersCollection();

    const hashPW = await bcrypt.hash(newPassword, constants.pwRounds);

    const updateInfo = await users.updateOne(
      { _id: new ObjectId(id) },
      { $set: { password: hashPW } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
      throw Error("Update failed");
    } else {
      return { updated: true };
    }
  },

  async loginUser(email, password) {
    if (!email) throw Error(`No email provided`);
    if (!password) throw Error(`No password provided`);

    const currUser = await this.getUserByEmail(email);

    if (!currUser) throw Error(`No account with that email`);

    utils.validatePassword(password);
    utils.validateEmail(email);
    email = email.trim().toLowerCase();
    password = password.trim();

    const hashPW = currUser.password;
    let validPassword = false;

    validPassword = await bcrypt.compare(password, hashPW);

    if (validPassword) {
      return currUser;
    } else {
      throw Error("Invalid email or password");
    }
  },

  async getUserByEmail(email) {
    if (!email) throw Error("No id supplied");
    utils.validateEmail(email);
    email = email.trim().toLowerCase();
    const users = await usersCollection();
    const user = await users.findOne({ email: email });
    return user;
  },
  async deleteAllEvents(userId) {
    utils.checkObjectIdString(userId);
    let user = await this.getUser(userId);
    if (!user) {
      throw new Error("No user found");
    }
    let tasks = user.taskIds;
    let reminders = user.reminderIds;
    let notes = user.noteIds;
    let meetings = user.meetingIds;

    for (let i = 0; i < tasks.length; i++) {
      let taskId = tasks[i].toString();
      await tasksDataFunctions.removeTask(taskId);
    }
    //TODO delete reminders
    for (let i = 0; i < reminders.length; i++) {
      let reminderId = reminders[i].toString();
      // await remindersDataFunctions.deleteReminderSingle(id, reminderId);
    }
    for (let i = 0; i < notes.length; i++) {
      let noteId = notes[i].toString();
      await notesDataFunctions.delete(noteId, userId);
    }
    for (let i = 0; i < meetings.length; i++) {
      let meetingId = meetings[i].toString();
      await meetingsDataFunctions.delete(meetingId);
    }
  },
  async deleteUser(userId) {
    utils.checkObjectIdString(userId);
    let user = await this.getUser(userId);

    await this.deleteAllEvents(userId);

    const users = await usersCollection();
    const deletionInfo = await users.findOneAndDelete({
      _id: new ObjectId(userId),
    });
    if (deletionInfo.lastErrorObject.n === 0) {
      throw new Error(`${userId} not found for deletion`);
    }
    return `User has been successfully deleted!`;
  },
};
export default exportedMethods;
