/*
Meeting Collection {
    _id: ObjectId,
    title: String,
    dateCreated: DateTimeStamp,
    dateAddedTo: DateTimeStamp,
    dateDueOn: DateTimeStamp,
    priority: Number,
    textBody: String,
    tag: String,
    repeating: Boolean,
    repeatingCounterIncrement:Number,
    repeatingIncrementBy : "Day" "Month" "Year"
    repeatingGroup: ObjectId
    expired:Boolean
    }
*/
import dayjs from "dayjs";
import utils from "../utils/utils.js";
import { ObjectId } from "mongodb";
import {
  meetingsCollection,
  usersCollection,
} from "../config/mongoCollections.js";
import constants from "./../constants/constants.js";

const meetingsDataFunctions = {
  async get(userId, meetingId) {
    // check if meetingId is a string and then check if its a valid Object Id with a new function called checkObjectIdString(stringObjectId)
    utils.checkObjectIdString(meetingId);
    utils.checkObjectIdString(userId);
    userId = userId.trim();
    meetingId = meetingId.trim();

    const users = await usersCollection();
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (
      !user.meetingIds.find((x) => {
        return x.toString() === meetingId;
      })
    ) {
      throw new Error("Meeting not found");
    }
    const meetings = await meetingsCollection();
    const meeting = await meetings.findOne({ _id: new ObjectId(meetingId) });

    // if the meeting exists in collection then return it else throw an error
    if (meeting) {
      return meeting;
    } else {
      throw new Error("Meeting not found");
    }
  },
  async update(
    userId,
    meetingId,
    title,
    dateAddedTo,
    dateDueOn,
    priority,
    textBody,
    tag,
    repeating,
    repeatingCounterIncrement,
    repeatingIncrementBy,
    updateAll = false
  ) {
    // check if meetingId is a string and then check if its a valid Object Id with a new function called checkObjectIdString(stringObjectId)

    utils.checkObjectIdString(userId);
    userId = userId.trim();
    utils.checkObjectIdString(meetingId);
    meetingId = meetingId.trim();
    //validate other fields

    let errorMessages = utils.validateMeetingCreateInputs(
      title,
      dateAddedTo,
      dateDueOn,
      priority,
      textBody,
      tag,
      repeating,
      repeatingCounterIncrement,
      repeatingIncrementBy
    );
    if (Object.keys(errorMessages).length !== 0) {
      throw errorMessages;
    }

    const meetings = await meetingsCollection();
    const oldMeeting = await this.get(userId, meetingId);
    let updatedMeeting = { ...oldMeeting };
    delete updatedMeeting._id;

    title = title.trim();

    if (typeof textBody === "string" && textBody.trim().length > 0) {
      textBody = textBody.trim();
    } else {
      textBody = null;
    }
    if (typeof tag === "string" && tag.trim().length > 0) {
      tag = tag.trim().toLowerCase();
    } else {
      tag = "meetings";
    }
    if (typeof dateAddedTo === "string" && dateAddedTo.trim().length > 0) {
      dateAddedTo = dayjs(dateAddedTo.trim()).format("YYYY-MM-DDTHH:mm");
    } else {
      dateAddedTo = null;
    }

    if (typeof dateDueOn === "string" && dateDueOn.trim().length > 0) {
      dateDueOn = dayjs(dateDueOn.trim()).format("YYYY-MM-DDTHH:mm");
    } else {
      dateDueOn = null;
    }

    priority = Number.parseInt(priority);
    repeatingCounterIncrement = !repeatingCounterIncrement
      ? repeatingCounterIncrement
      : Number.parseInt(repeatingCounterIncrement);
    repeating = repeating === "true" || repeating === true ? true : false;
    repeatingIncrementBy = repeatingIncrementBy?.trim();

    updatedMeeting.title = title;
    updatedMeeting.dateAddedTo = dateAddedTo;
    updatedMeeting.dateDueOn = dateDueOn;
    updatedMeeting.priority = priority;
    updatedMeeting.textBody = textBody;
    updatedMeeting.tag = tag;
    updatedMeeting.repeating = repeating;
    updatedMeeting.repeatingCounterIncrement = repeatingCounterIncrement;
    updatedMeeting.repeatingIncrementBy = repeatingIncrementBy;

    // wasnt repeating but now is creating of series
    if (
      dateAddedTo !== null &&
      dateDueOn !== null &&
      repeating === true &&
      oldMeeting.repeating !== updatedMeeting.repeating
    ) {
      const repeatingGroup = new ObjectId();
      updatedMeeting.repeatingGroup = repeatingGroup;
      let dateAddedToObject = dayjs(dateAddedTo);
      let dateDueOnObject = dayjs(dateDueOn);
      const meetingObjects = [];
      let newDateDueOn;
      let newDateAddedTo;
      for (let i = 0; i < repeatingCounterIncrement; i++) {
        switch (repeatingIncrementBy) {
          case "day":
            newDateDueOn = dateDueOnObject.add(1, "day");
            newDateAddedTo = dateAddedToObject.add(1, "day");
            break;
          case "week":
            newDateDueOn = dateDueOnObject.add(7, "week");
            newDateAddedTo = dateAddedToObject.add(7, "week");
            break;
          case "month":
            newDateDueOn = dateDueOnObject.add(1, "month");
            newDateAddedTo = dateAddedToObject.add(1, "month");
            break;
          case "year":
            newDateDueOn = dateDueOnObject.add(1, "year");
            newDateAddedTo = dateAddedToObject.add(1, "year");
            break;
          default:
            throw new Error("Invalid repeatingIncrementBy value");
        }
        dateDueOnObject = newDateDueOn.clone();
        dateAddedToObject = newDateAddedTo.clone();
        let dateCreated = dayjs().format("YYYY-MM-DDTHH:mm");
        const meeting = {
          ...updatedMeeting,
          dateCreated: dateCreated,
          dateAddedTo: newDateAddedTo.format("YYYY-MM-DDTHH:mm"),
          dateDueOn: newDateDueOn.format("YYYY-MM-DDTHH:mm"),
          repeatingGroup: repeatingGroup,
        };
        meetingObjects.push(meeting);
      }

      const result = await meetings.insertMany(meetingObjects);
      const insertedIds = Object.values(result.insertedIds);
      const users = await usersCollection();

      await users.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { meetingIds: { $each: insertedIds } } }
      );
    }
    // was repeating before and isnt now  removal of series
    if (
      !repeating &&
      updatedMeeting.repeatingGroup?.toString()?.trim() &&
      oldMeeting.repeating !== updatedMeeting.repeating
    ) {
      await this.deleteAllRecurrences(
        userId,
        updatedMeeting.repeatingGroup.toString().trim(),
        meetingId // which meeting to skip
      );
      updatedMeeting.repeatingGroup = null;
    }

    //updateAllRecurrences update entire series
    if (
      updateAll &&
      repeating &&
      updatedMeeting.repeatingGroup?.toString()?.trim() &&
      oldMeeting.repeating == updatedMeeting.repeating &&
      dateAddedTo !== null &&
      dateDueOn !== null
    ) {
      await this.updateAllRecurrences(
        userId,
        updatedMeeting.title,
        updatedMeeting.dateAddedTo,
        updatedMeeting.dateDueOn,
        updatedMeeting.priority,
        updatedMeeting.textBody,
        updatedMeeting.tag,
        updatedMeeting.repeatingGroup.toString()
      );
      await meetings.updateOne(
        { _id: new ObjectId(meetingId) },
        { $set: updatedMeeting }
      );
      let result = await meetings.findOne({
        _id: new ObjectId(meetingId),
      });
      return result;
    }
    // if theres no change in repeating status means normal update
    else {
      const result = await meetings.updateOne(
        { _id: new ObjectId(meetingId) },
        { $set: updatedMeeting }
      );

      // if the meeting was successfully updated, return the updated meeting
      if (
        result.modifiedCount === 1 &&
        result.matchedCount == 1 &&
        result.acknowledged === true
      ) {
        const updatedMeeting = await meetings.findOne({
          _id: new ObjectId(meetingId),
        });
        return updatedMeeting;
      } else {
        if (result.matchedCount !== 1) throw new Error("Meeting not found");
        if (result.modifiedCount !== 1)
          throw new Error("Meeting Details havent Changed");
        if (result.acknowledged !== true)
          throw new Error("Meeting update wasnt successfull");
      }
    }
  },
  async delete(meetingId, userId) {
    utils.checkObjectIdString(meetingId);
    meetingId = meetingId.trim();

    utils.checkObjectIdString(userId);
    userId = userId.trim();
    const users = await usersCollection();
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (
      !user.meetingIds.find((x) => {
        return x.toString() === meetingId;
      })
    ) {
      throw new Error("Meeting not found");
    }
    const meetings = await meetingsCollection();
    const deletionInfo = await meetings.findOneAndDelete({
      _id: new ObjectId(meetingId),
    });
    if (deletionInfo.lastErrorObject.n === 0) {
      throw new Error(`${meetingId} not found for deletion`);
    }

    //update the userCollection by removing the same id from the meetingIds array in user collection
    await users.updateOne(
      { meetingIds: new ObjectId(meetingId) },
      { $pull: { meetingIds: new ObjectId(meetingId) } }
    );

    // if the meeting exists in collection then return it else throw an error
    return `${deletionInfo.value._id} has been successfully deleted!`;
  },

  /**
   * @param {string} userId userId of which the meeting is being created for
   * @param {string} title title of the meeting
   * @param {Date} dateAddedTo which date this meeting belongs t
   * @param {Date} dateDueOn when does this meeting end passed or calculated
   * param {number} duration duration of the meeting either passed or calculated
   * @param {number} priority priority of the meeting 1 2 or 3
   * @param {string} textBody description of meeting
   * @param {string} tag custom tag
   * @param {boolean} repeating whether it repeats
   * @param {number} repeatingCounterIncrement how many times the meeting repeats.. calculated using a start and end date of repetations from the UI .. it casues the function to repeatedly create the meeting for those many consecutive day monht or year
   * @param {string} repeatingIncrementBy mode of repeating "day" "month" or "year"
   */
  async create(
    userId,
    title,
    dateAddedTo,
    dateDueOn,
    priority,
    textBody,
    tag,
    repeating,
    repeatingCounterIncrement,
    repeatingIncrementBy
  ) {
    utils.checkObjectIdString(userId);
    userId = userId.trim();
    let errorMessages = utils.validateMeetingCreateInputs(
      title,
      dateAddedTo,
      dateDueOn,
      priority,
      textBody,
      tag,
      repeating,
      repeatingCounterIncrement,
      repeatingIncrementBy
    );
    //TODO validate repeating if its a correct boolean string using validateBoolean()
    //TODO make repeating a boolean from string
    if (Object.keys(errorMessages).length !== 0) {
      throw errorMessages;
    }

    title = title.trim();
    if (typeof textBody === "string" && textBody.trim().length > 0) {
      textBody = textBody.trim();
    } else {
      textBody = null;
    }
    if (typeof tag === "string" && tag.trim().length > 0) {
      tag = tag.trim().toLowerCase();
    } else {
      tag = "meetings";
    }
    if (typeof dateAddedTo === "string" && dateAddedTo.trim().length > 0) {
      dateAddedTo = dayjs(dateAddedTo.trim()).format("YYYY-MM-DDTHH:mm");
    } else {
      dateAddedTo = null;
    }

    if (typeof dateDueOn === "string" && dateDueOn.trim().length > 0) {
      dateDueOn = dayjs(dateDueOn.trim()).format("YYYY-MM-DDTHH:mm");
    } else {
      dateDueOn = null;
    }
    priority = Number.parseInt(priority);
    repeatingCounterIncrement = !repeatingCounterIncrement
      ? repeatingCounterIncrement
      : Number.parseInt(repeatingCounterIncrement);
    repeating = repeating === "true" || repeating === true ? true : false;
    repeatingIncrementBy = repeatingIncrementBy?.trim();

    let dateAddedToObject = dayjs(dateAddedTo);
    let dateDueOnObject = dayjs(dateDueOn);

    const users = await usersCollection();
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw new Error("User not found.");
    }
    let dateCreated = dayjs().format("YYYY-MM-DDTHH:mm");
    const meetings = await meetingsCollection();

    let meetingObj = {
      title,
      dateCreated,
      dateAddedTo,
      dateDueOn,
      priority,
      textBody,
      tag,
      repeating,
      repeatingCounterIncrement,
      repeatingIncrementBy,
      repeatingGroup: null,
      expired: false,
      type: "meeting",
    };
    if (!repeating) {
      let allMeetingEvents = await this.getAll(userId);
      for (let i = 0; i < allMeetingEvents.length; i++) {
        this.isTwoEventSame(allMeetingEvents[i], meetingObj);
      }
      const result = await meetings.insertOne(meetingObj);
      const insertedId = result.insertedId;
      await users.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { meetingIds: insertedId } }
      );
      return this.get(userId, insertedId.toString());
    } else {
      const repeatingGroup = new ObjectId();
      const meetingObjects = [];

      for (let i = 0; i < repeatingCounterIncrement; i++) {
        let newDateDueOn = dateDueOnObject.clone();
        let newDateAddedTo = dateAddedToObject.clone();
        const meeting = {
          title,
          dateCreated,
          dateAddedTo: newDateAddedTo.format("YYYY-MM-DDTHH:mm"),
          dateDueOn: newDateDueOn.format("YYYY-MM-DDTHH:mm"),
          priority,
          textBody,
          tag,
          repeating,
          repeatingCounterIncrement,
          repeatingIncrementBy,
          repeatingGroup,
          expired: false,
          type: "meeting",
        };
        meetingObjects.push(meeting);
        switch (repeatingIncrementBy) {
          //TODO use dayjs
          case "day":
            newDateDueOn = dateDueOnObject.add(1, "day");
            newDateAddedTo = dateAddedToObject.add(1, "day");
            break;
          case "week":
            newDateDueOn = dateDueOnObject.add(7, "week");
            newDateAddedTo = dateAddedToObject.add(7, "week");
            break;
          case "month":
            newDateDueOn = dateDueOnObject.add(1, "month");
            newDateAddedTo = dateAddedToObject.add(1, "month");
            break;
          case "year":
            newDateDueOn = dateDueOnObject.add(1, "year");
            newDateAddedTo = dateAddedToObject.add(1, "year");
            break;
          default:
            throw new Error("Invalid repeatingIncrementBy value");
        }
        dateDueOnObject = newDateDueOn.clone();
        dateAddedToObject = newDateAddedTo.clone();
      }
      let allMeetingEvents = await this.getAll(userId);
      for (let i = 0; i < allMeetingEvents.length; i++) {
        for (let j = 0; j < meetingObjects.length; j++) {
          this.isTwoEventSame(allMeetingEvents[i], meetingObjects[j]);
        }
      }
      const result = await meetings.insertMany(meetingObjects);
      const insertedIds = Object.values(result.insertedIds);
      await users.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { meetingIds: { $each: insertedIds } } }
      );
      return await this.getAll(userId);
    }
  },

  async getAll(userId) {
    utils.checkObjectIdString(userId);
    userId = userId.trim();
    const users = await usersCollection();
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (user) {
      const meetingIdList = user.meetingIds;
      const meetings = await meetingsCollection();
      const meetingsList = await meetings
        .find({ _id: { $in: meetingIdList } })
        .toArray();
      return meetingsList;
    } else {
      throw new Error("user not found");
    }
  },

  // userId and repeatingGroup needed
  async getAllRecurrences(userId, repeatingGroup) {
    utils.checkObjectIdString(userId);
    userId = userId.trim();
    utils.checkObjectIdString(repeatingGroup);
    repeatingGroup = repeatingGroup.trim();

    const users = await usersCollection();
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (user) {
      const meetingIdList = user.meetingIds;
      const meetings = await meetingsCollection();
      const recurringMeetingsList = await meetings
        .find({
          _id: { $in: meetingIdList },
          repeatingGroup: new ObjectId(repeatingGroup),
        })
        .toArray();
      return recurringMeetingsList;
    } else {
      throw new Error("repeatingGroup of meetings not found");
    }
  },
  async updateAllRecurrences(
    userId,
    title,
    dateAddedTo,
    dateDueOn,
    priority,
    textBody,
    tag,
    repeatingGroup
  ) {
    utils.checkObjectIdString(userId.trim());
    utils.checkObjectIdString(repeatingGroup.toString().trim());

    let errorMessages = utils.validateMeetingCreateInputs(
      title,
      dateAddedTo,
      dateDueOn,
      priority,
      textBody,
      tag
    );
    if (Object.keys(errorMessages).length !== 0) {
      throw errorMessages;
    }

    userId = userId.trim();
    title = title.trim();
    dateAddedTo = dateAddedTo.trim();
    dateDueOn = dateDueOn.trim();
    tag = tag.trim().toLowerCase();
    repeatingGroup = repeatingGroup.trim();

    const users = await usersCollection();
    const user = await users.findOne({ _id: new ObjectId(userId) });
    const meetingIdList = user.meetingIds;
    const meetings = await meetingsCollection();
    const result = await meetings.updateMany(
      {
        _id: { $in: meetingIdList },
        repeatingGroup: new ObjectId(repeatingGroup),
      },
      {
        $set: {
          title: title,
          // dateAddedTo: dateAddedTo,
          // dateDueOn: dateDueOn,
          priority: priority,
          textBody: textBody,
          tag: tag,
        },
      }
    );

    if (result.acknowledged === true) {
      const updatedMeetings = await this.getAllRecurrences(
        userId,
        repeatingGroup
      );
      return updatedMeetings;
    } else {
      if (result.matchedCount == 0) throw new Error("Meetings not found");
      if (result.modifiedCount == 0)
        throw new Error("Meetings Details havent Changed");
      if (result.acknowledged !== true)
        throw new Error("Meetings update wasnt successfull");
    }
  },
  async deleteAllRecurrences(userId, repeatingGroup, meetingIdToSkip = "") {
    utils.checkObjectIdString(userId.trim());
    utils.checkObjectIdString(repeatingGroup.trim());

    userId = userId.trim();
    repeatingGroup = repeatingGroup.trim();

    const users = await usersCollection();
    const user = await users.findOne({ _id: new ObjectId(userId) });
    let meetingIdList = user.meetingIds;
    if (meetingIdToSkip !== "") {
      meetingIdList = meetingIdList.filter((x) => {
        return x.toString() !== meetingIdToSkip;
      });
    }
    const meetings = await meetingsCollection();

    const result = await meetings.deleteMany({
      _id: { $in: meetingIdList },
      repeatingGroup: new ObjectId(repeatingGroup),
    });

    if (result.deletedCount > 0 && result.acknowledged === true) {
      return result;
    } else {
      if (result.deletedCount == 0) throw new Error("Meetings not found");
      if (result.acknowledged !== true)
        throw new Error("Meetings delete was not successful");
    }
  },

  async getDistinctTags() {
    const meetings = await meetingsCollection();
    return meetings.distinct("tag");
  },

  isTwoEventSame(event1, event2) {
    if (event1["title"] === event2["title"]) {
      if (
        event1["dateAddedTo"] !== null &&
        event2["dateAddedTo"] !== null &&
        dayjs(event1["dateAddedTo"]).year() ===
          dayjs(event2["dateAddedTo"]).year() &&
        dayjs(event1["dateAddedTo"]).month() ===
          dayjs(event2["dateAddedTo"]).month() &&
        dayjs(event1["dateAddedTo"]).date() ===
          dayjs(event2["dateAddedTo"]).date() &&
        dayjs(event1["dateDueOn"]).diff(event2["dateAddedTo"]) > 0 &&
        dayjs(event2["dateDueOn"]).diff(event1["dateAddedTo"] > 0)
      ) {
        throw new Error(
          "Two Meetings have the same title and a date time clash"
        );
      } else if (
        event1["dateAddedTo"] === null &&
        event2["dateAddedTo"] === null
      ) {
        throw new Error(
          "There cannot be two meetings of same title that is waiting to be scheduled"
        );
      }
    }
  },
};
export default meetingsDataFunctions;
