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
    if (typeof input !== "boolean") {
      throw new Error(`${inputName} must be a boolean value`);
    }
  },

  validateRepeatingCounterIncrement(repeatingCounterIncrement) {
    if (
      isNaN(repeatingCounterIncrement) ||
      typeof repeatingCounterIncrement !== "number" ||
      repeatingCounterIncrement <= 0
    ) {
      throw new Error(
        "RepeatingCounterIncrement must be a positive number greater than 0"
      );
    }
  },

  validateRepeatingIncrementBy(repeatingIncrementBy) {
    if (
      typeof repeatingIncrementBy !== "string" ||
      repeatingIncrementBy.trim().length === 0 ||
      !/^(day|week|month|year)$/.test(repeatingIncrementBy.trim())
    ) {
      throw new Error(
        "RepeatingIncrementBy must be a string with value 'day', 'week', 'month' or 'year'"
      );
    }
  },
  validateDateRange(dateAddedTo, dateDueOn) {
    if (
      dateAddedTo &&
      dateDueOn &&
      new Date(dateAddedTo).getTime() >= new Date(dateDueOn).getTime()
    ) {
      throw new Error("DateDueOn must be after DateAddedTo");
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
    if (repeating) {
      this.validateRepeatingCounterIncrement(repeatingCounterIncrement);
      this.validateRepeatingIncrementBy(repeatingIncrementBy);
    }
    this.validateDateRange(dateAddedTo, dateDueOn);
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
    this.validateDateRange(dateAddedTo, dateDueOn);

    return true;
  },
  validateMeetingUpdateAllRecurrencesInputs(
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

    return true;
  },
};

export default utils;
