import { usersCollection } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import utils from "../utils/utils.js";
import bcrypt from "bcrypt";
import constants from "../constants/constants.js";

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
    utils.validateBooleanInput(disability, "Disability");
    utils.validateDate(dob, "Date of Birth");
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
      disability: disability,
      dob: dob,
      consent: consent,
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
  async updateUser(id, { first_name, last_name, email, disability, dob }) {
    utils.checkObjectIdString(id);
    utils.validateName(first_name, "First name");
    utils.validateName(last_name, "Last name");
    utils.validateEmail(email, "Email");
    utils.validateBooleanInput(disability, "Disability");
    utils.validateDate(dob, "Date of Birth");
    id = id.trim();
    first_name = first_name.trim();
    last_name = last_name.trim();
    email = email.trim().toLowerCase();
    dob = dob.trim();
    const users = await usersCollection();
    const currUser = await this.getUser(id);

    let updatedUser = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: currUser.password,
      disability: disability,
      dob: dob,
      consent: currUser.Consent,
      taskIds: currUser.taskIds,
      reminderIds: currUser.reminderIds,
      noteIds: currUser.noteIds,
      meetingIds: currUser.meetingIds,
    };
    const updateInfo = await users.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedUser }
    );
    return updatedUser;
  },

  async changePassword(id, newPassword) {
    utils.checkObjectIdString(id);
    utils.validatePassword(newPassword);
    newPassword = newPassword.trim();
    id = id.trim();
    let users = await usersCollection();
    const currUser = await this.getUser(id);
    const isSamePassword = await bcrypt.compare(newPassword, currUser.password);
    if (isSamePassword) {
      throw Error("New password must be different from current password");
    }

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
      throw Error("Invalid password");
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
};
export default exportedMethods;
