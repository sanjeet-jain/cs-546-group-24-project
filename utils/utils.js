// this is where all common helper files will go
import { ObjectId } from "mongodb";
const utils = {
  checkObjectIdString(stringObjectId) {
    if (typeof stringObjectId !== "string") {
      return false;
    }

    try {
      new ObjectId(stringObjectId);
      return true;
    } catch (error) {
      return false;
    }
  },

  validateDate(date, paramName) {
    if (typeof date === "string") {
      date = new Date(date);
    }

    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error(
        `${paramName} must be a valid Date object or a string that can be parsed as a date`
      );
    }
  },

  validatePriority(priority) {
    if (
      !priority ||
      typeof priority !== "number" ||
      priority < 1 ||
      priority > 3
    ) {
      throw new Error("Priority must be a number between 1 and 3");
    }
  },

  validateStringInput(input, inputName, maxLength) {
    if (input && typeof input !== "string") {
      throw new Error(`${inputName} must be a string`);
    } else if (input && input.trim().length === 0) {
      throw new Error(`${inputName} cannot be an empty string`);
    } else if (input && maxLength && input.trim().length > maxLength) {
      throw new Error(
        `${inputName} cannot be longer than ${maxLength} characters`
      );
    }
  },

  validateBooleanInput(input, inputName) {
    if (input && typeof input !== "boolean") {
      throw new Error(`${inputName} must be a boolean value`);
    }
  },

  validateRepeatingCounterIncrement(repeatingCounterIncrement) {
    if (
      repeatingCounterIncrement &&
      (typeof repeatingCounterIncrement !== "number" ||
        repeatingCounterIncrement <= 0)
    ) {
      throw new Error(
        "RepeatingCounterIncrement must be a positive number greater than 0"
      );
    }
  },

  validateRepeatingIncrementBy(repeatingIncrementBy) {
    if (
      repeatingIncrementBy &&
      (typeof repeatingIncrementBy !== "string" ||
        !/^(day|week|month|year)$/.test(repeatingIncrementBy))
    ) {
      throw new Error(
        "RepeatingIncrementBy must be a string with value 'day', 'week', 'month' or 'year'"
      );
    }
  },
  validateMeetingCreateInputs(
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
    this.validateStringInput(title, "title", 100);
    this.validateDate(dateAddedTo, "DateAddedTo");
    this.validateDate(dateDueOn, "DateDueOn");
    this.validatePriority(priority);
    this.validateStringInput(textBody, "textBody", 200);
    this.validateStringInput(tag, "tag", 20);
    this.validateBooleanInput(repeating, "repeating");
    this.validateRepeatingCounterIncrement(repeatingCounterIncrement);
    this.validateRepeatingIncrementBy(repeatingIncrementBy);
    if (
      dateAddedTo &&
      dateDueOn &&
      dateAddedTo.getTime() >= dateDueOn.getTime()
    ) {
      throw new Error("DateDueOn must be after DateAddedTo");
    }
    return true;
  },

  validateMeetingUpdateInputs(
    title,
    dateAddedTo,
    dateDueOn,
    priority,
    textBody,
    tag
  ) {
    this.validateStringInput(title, "title", 100);
    this.validateDate(dateAddedTo, "DateAddedTo");
    this.validateDate(dateDueOn, "DateDueOn");
    this.validatePriority(priority);
    this.validateStringInput(textBody, "textBody", 200);
    this.validateStringInput(tag, "tag", 20);
    if (
      dateAddedTo &&
      dateDueOn &&
      new Date(dateAddedTo).getTime() >= new Date(dateDueOn).getTime()
    ) {
      throw new Error("DateDueOn must be after DateAddedTo");
    }
    return true;
  },
};

export default utils;
