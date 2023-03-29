// this is where all common helper files will go
import { ObjectId } from "mongodb";
import constants from "./../constants/constants.js";

const utils = {
  checkObjectIdString(stringObjectId) {
    this.validateStringInput(stringObjectId, "objectID");
    stringObjectId = stringObjectId.trim();
    if (!ObjectId.isValid(stringObjectId)) {
      throw new Error("object id is not valid");
    }
  },
  validateStringInput(input, inputName) {
    if (input && typeof input !== "string") {
      throw new Error(`${inputName} must be a string`);
    } else if (input && input.trim().length === 0) {
      throw new Error(`${inputName} cannot be an empty string`);
    }
  },
  validateStringInputWithMaxLength(input, inputName, maxLength) {
    this.validateStringInput(input, inputName);
    if (input.trim().length > maxLength) {
      throw new Error(
        `${inputName} cannot be longer than ${maxLength} characters`
      );
    }
  },

  validateDate(date, paramName) {
    this.validateStringInput(date, paramName);
    date = date.trim();
    date = new Date(date);

    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error(
        `${paramName} must be a valid Date object or a string that can be parsed as a date`
      );
    }
  },
  validateInputIsNumber(input, inputName) {
    if (typeof input !== "number" || isNaN(input)) {
      throw new Error(`${inputName} is not a number `);
    }
  },

  validatePriority(priority) {
    this.validateInputIsNumber(priority, "priority");
    if (!Number.isInteger(priority)) {
      throw new Error("priority cant be a float");
    }
    if (!priority || priority < 1 || priority > 3) {
      throw new Error("Priority must be a number between 1 and 3");
    }
  },

  validateBooleanInput(input, inputName) {
    if (typeof input !== "boolean") {
      throw new Error(`${inputName} must be a boolean value`);
    }
  },

  validateRepeatingCounterIncrement(repeatingCounterIncrement) {
    this.validateInputIsNumber(
      repeatingCounterIncrement,
      "repeatingCounterIncrement"
    );
    if (repeatingCounterIncrement <= 0) {
      throw new Error(
        "RepeatingCounterIncrement must be a positive number greater than 0"
      );
    }
  },

  validateRepeatingIncrementBy(repeatingIncrementBy) {
    this.validateStringInput(repeatingIncrementBy, "repeatingIncrementBy");
    repeatingIncrementBy = repeatingIncrementBy.trim();
    if (!/^(day|week|month|year)$/.test(repeatingIncrementBy)) {
      throw new Error(
        "RepeatingIncrementBy must be a string with value 'day', 'week', 'month' or 'year'"
      );
    }
  },
  validateDateRange(dateAddedTo, dateDueOn) {
    this.validateStringInput(dateAddedTo, "dateAddedTo");
    this.validateStringInput(dateDueOn, "dateDueOn");

    dateAddedTo = dateAddedTo.trim();
    dateDueOn = dateDueOn.trim();
    this.validateDate(dateAddedTo, "dateAddedTo");
    this.validateDate(dateDueOn, "dateDueOn");
    if (new Date(dateAddedTo).getTime() >= new Date(dateDueOn).getTime()) {
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
    this.validateStringInput(title, "title", constants.stringLimits["title"]);
    this.validateDate(dateAddedTo, "DateAddedTo");
    this.validateDate(dateDueOn, "DateDueOn");
    this.validatePriority(priority);
    this.validateStringInput(
      textBody,
      "textBody",
      constants.stringLimits["textBody"]
    );
    this.validateStringInput(tag, "tag", constants.stringLimits["tag"]);
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
    this.validateStringInput(title, "title", constants.stringLimits["title"]);
    this.validateDate(dateAddedTo, "DateAddedTo");
    this.validateDate(dateDueOn, "DateDueOn");
    this.validatePriority(priority);
    this.validateStringInput(
      textBody,
      "textBody",
      constants.stringLimits["textBody"]
    );
    this.validateStringInput(tag, "tag", constants.stringLimits["tag"]);
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
    this.validateStringInput(title, "title", constants.stringLimits["title"]);
    this.validateDate(dateAddedTo, "DateAddedTo");
    this.validateDate(dateDueOn, "DateDueOn");
    this.validatePriority(priority);
    this.validateStringInput(
      textBody,
      "textBody",
      constants.stringLimits["textBody"]
    );
    this.validateStringInput(tag, "tag", constants.stringLimits["tag"]);

    return true;
  },
};

export default utils;
