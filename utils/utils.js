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
    } else if (input.trim().length === 0) {
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

  validateInputIsNumber(input, inputName) {
    if (typeof input === "string") {
      this.validateStringInput(input, inputName);
      input = Number(input.trim());
    }
    if (typeof input !== "number" || isNaN(input)) {
      throw new Error(`${inputName} is not a number `);
    }
  },

  validatePriority(priority) {
    if (typeof priority === "string") {
      this.validateStringInput(priority, "priority");

      priority = Number(priority.trim());
    }
    this.validateInputIsNumber(priority, "priority");
    if (!Number.isInteger(priority)) {
      throw new Error("priority cant be a float");
    }
    if (!priority || priority < 1 || priority > 3) {
      throw new Error("Priority must be a number between 1 and 3");
    }
  },

  validateBooleanInput(input, inputName) {
    if (typeof input === "string") {
      this.validateStringInput(input, inputName);

      if (input === "true" || input === "false") {
        input = input.trim() === "true" ? true : false;
      }
    }
    if (typeof input !== "boolean") {
      throw new Error(`${inputName} must be a boolean value`);
    }
  },

  validateName(name, inputName) {
    this.validateStringInput(name);
    if (!/^[a-zA-Z]+$/.test(name)) {
      throw new Error(`${inputName} can only contain letters`);
    }
  },
  validateEmail(email, inputName) {
    this.validateStringInput(email, inputName);
    const regex = "^[a-zA-Z]+[._%+-]*[a-zA-Z0-9]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$";
    if (!email.toLowerCase().match(regex)) {
      throw new Error(`${inputName} is not an email`);
    }
  },
  validatePassword(password) {
    if (!password) {
      throw new Error("Please enter a password");
    }
    this.validateStringInput(password, "Password");
    if (password.length < constants.stringLimits.password) {
      throw new Error("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error("Password must contain at least one uppercase letter");
    }
    if (!/[0-9]/.test(password)) {
      throw new Error("Password must contain at least one number");
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
    //TODO check date as well ! not just time
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
    let errorMessages = {};
    try {
      this.validateStringInputWithMaxLength(
        title,
        "title",
        constants.stringLimits["title"]
      );
    } catch (e) {
      errorMessages.title = e.message;
    }
    try {
      this.validateDate(dateAddedTo, "DateAddedTo");
    } catch (e) {
      errorMessages.dateAddedTo = e.message;
    }

    try {
      this.validateDate(dateDueOn, "DateDueOn");
    } catch (e) {
      errorMessages.dateDueOn = e.message;
    }

    try {
      this.validatePriority(priority);
    } catch (e) {
      errorMessages.priority = e.message;
    }

    try {
      this.validateStringInputWithMaxLength(
        textBody,
        "textBody",
        constants.stringLimits["textBody"]
      );
    } catch (e) {
      errorMessages.textBody = e.message;
    }

    try {
      this.validateStringInputWithMaxLength(
        tag,
        "tag",
        constants.stringLimits["tag"]
      );
    } catch (e) {
      errorMessages.tag = e.message;
    }
    if (repeating) {
      try {
        this.validateBooleanInput(repeating, "repeating");
      } catch (error) {
        errorMessages.repeating = error.message;
      }
      try {
        this.validateRepeatingCounterIncrement(repeatingCounterIncrement);
      } catch (error) {
        errorMessages.repeatingCounterIncrement = error.message;
      }

      try {
        this.validateRepeatingIncrementBy(repeatingIncrementBy);
      } catch (error) {
        errorMessages.repeatingIncrementBy = error.message;
      }
    }
    try {
      this.validateDateRange(dateAddedTo, dateDueOn);
    } catch (error) {
      errorMessages.dateDueOn = error.message;
    }
    return errorMessages;
  },

  /**
   * @param {date object} date1
   * @param {date object} date2
   */
  isDateObjEqual(date1Str, date2Str) {
    this.validateDate(date1Str);
    this.validateDate(date2Str);
    let date1 = new Date(date1);
    let date2 = new Date(date2);
    if (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate() &&
      date1.getHours() === date2.getHours() &&
      date1.getMinutes() === date2.getMinutes()
    ) {
      return true;
    }
    return false;
  },

  /**
   * Created for reminders to find id there are reminders that are overlapping with eachother
   * @param {*} startDateTime
   * @param {*} endDateTime
   * @param {*} dateTime
   */
  isDateStrOverllaping(startDateTimeStr, endDateTimeStr, dateTimeStr) {
    let startDateTime = utils.getNewDateStr(startDateTimeStr);
    let endDateTime = utils.getNewDateStr(endDateTimeStr);
    let dateTime = utils.getNewDateStr(dateTimeStr);
    if (
      startDateTime.getMinutes() === dateTime.getMinutes() &&
      startDateTime.getHours() === dateTime.getHours() &&
      dateTime.getDate() >= startDateTime.getDate() &&
      dateTime.getDate() <= endDateTime.getDate() &&
      dateTime.getMonth() >= startDateTime.getMonth() &&
      dateTime.getMonth() <= endDateTime.getMonth() &&
      dateTime.getFullYear() >= startDateTime.getFullYear() &&
      dateTime.getFullYear() <= endDateTime.getFullYear()
    ) {
      return true;
    }
    return false;
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

  //Dates are stored as string
  /**Changes Made to existing code */
  // validateDateObj(date, paramName) {
  //   if (!(date instanceof Date) || isNaN(date.getTime())) {
  //     throw new Error(
  //       `${paramName} must be a valid Date object or a string that can be parsed as a date`
  //     );
  //   }
  // },

  getNewDateStr(dateObj) {
    return `${dateObj.getMonth()}/${dateObj.getDate()}/${dateObj.getFullYear()} ${dateObj.getHours()}:${dateObj.getMinutes()}`;
  },

  /**
   * MM/DD/YYYY 12:13
   * @param {*} dateTimeString
   */
  getNewDateObjectFromString(dateTimeString) {
    this.validateStringInput(dateTimeString);
    let strList = dateTimeString.split(" ");
    let timeStr = strList[1].split(":");
    let dateStr = strList[0].split("/");
    return this.getNewDateObject(
      Number.parseInt(dateStr[2]),
      Number.parseInt(dateStr[0]),
      Number.parseInt(dateStr[1]),
      Number.parseInt(timeStr[0]),
      Number.parseInt(timeStr[1])
    );
  },
  validateNotesInputs(
    title,
    dateAddedTo,
    textBody,
    tag,
    documentLinks // how to use this ???????
  ) {
    utils.validateStringInputWithMaxLength(
      title,
      "title",
      constants.stringLimits["title"]
    );
    utils.validateDate(dateAddedTo, "DateAddedTo");
    // textbody?
    //doc links ?
    utils.validateStringInputWithMaxLength(
      tag,
      "tag",
      constants.stringLimits["tag"]
    );
  },
};

export default utils;
