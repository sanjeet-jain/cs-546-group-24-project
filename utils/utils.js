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
    if (typeof input === "string" && (input === "true" || input === "false")) {
      input = input === "true" ? true : false;
    }

    if (typeof input !== "boolean") {
      throw new Error(`${inputName} must be a boolean value`);
    }
  },

  validateName(name, inputName) {
    this.validateStringInput(name);
    console.log(name);
    const nameRegex = /^[a-zA-Z]+$/;
    if (!nameRegex.test(name)) {
      throw new Error(`${inputName} can only contain letters`);
    }
  },
  validateEmail(email, inputName) {
    this.validateStringInput(email);
    const regex = "^[a-zA-Z]+[._%+-]*[a-zA-Z0-9]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$";
    if (!email.toLowerCase().match(regex)) {
      throw new Error(`${inputName} is not an email`);
    }
  },
  validatePassword(password, inputName) {
    if (!password) {
      throw new Error("Please enter a password");
    }
    this.validateStringInput(password);
    password = password.trim();
    if (password.length < constants.stringLimits.password) {
      throw new Error(`${inputName} must be at least 8 characters long`);
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error(
        `${inputName} must contain at least one uppercase letter and one number`
      );
    }
    // if (!/[A-Z]/.test(password)) {
    //   throw new Error("Password must contain at least one uppercase letter");
    // }
    // if (!/[0-9]/.test(password)) {
    //   throw new Error("Password must contain at least one number");
    // }
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

  /**
   * @param {date object} date1
   * @param {date object} date2
   */
  isDateObjEqual(date1, date2) {
    this.validateDateObj(date1);
    this.validateDateObj(date2);
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
  isDateObjOverllaping(startDateTime, endDateTime, dateTime) {
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

  dateObjPersistDB(dateTime) {
    this.validateDate(dateTime);
    let standardisedDate = new Date();
    standardisedDate.setFullYear(dateTime.getFullYear());
    standardisedDate.setMonth(dateTime.getMonth());
    standardisedDate.setDate(dateTime.getDate());
    standardisedDate.setHours(dateTime.getHours());
    standardisedDate.setMinutes(dateTime.getMinutes());
    return standardisedDate;
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

  /**Changes Made to existing code */
  validateDateObj(date, paramName) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error(
        `${paramName} must be a valid Date object or a string that can be parsed as a date`
      );
    }
  },
  validateAge(dob, min_age, max_age) {
    this.validateDate(dob, "dob");
    let today = new Date();
    dob = new Date(dob);
    let age = today.getFullYear() - dob.getFullYear();
    let m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    if (age < min_age || age > max_age) {
      throw new Error(
        `Age must be between ${min_age} and ${max_age} years old`
      );
    }
  },

  getNewDateObject(fullYear, month, date, hours, minutes) {
    let dateObj = new Date();
    dateObj.setFullYear(fullYear);
    dateObj.setMonth(month);
    dateObj.setDate(date);
    dateObj.setHours(hours);
    dateObj.setMinutes(minutes);
    return dateObj;
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
};

export default utils;
