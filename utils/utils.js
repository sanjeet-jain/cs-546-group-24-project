// this is where all common helper files will go
import { ObjectId } from "mongodb";
import constants from "./../constants/constants.js";
import dayjs from "dayjs";
import { JSDOM } from "jsdom";
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
  validateStringInputWithMaxLength(input, inputName, maxLength, isOptional) {
    this.validateStringInput(input, inputName, isOptional);
    if (
      inputName === "tag" &&
      !input
        .trim()
        .toLowerCase()
        .match(/^[a-zA-Z]+$/g)
    ) {
      throw new Error(
        `${inputName} can not have spaces and contains only letters`
      );
    }
    if (
      inputName === "title" &&
      !input
        .trim()
        .toLowerCase()
        .match(/^(?![\d])[\w\s]+$/gi)
    ) {
      throw new Error(
        `${inputName} can not have spaces and contains only letters`
      );
    }

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
    return input;
  },

  validateName(name, inputName) {
    this.validateStringInput(name);
    this.validateStringInputWithMaxLength(
      name,
      inputName,
      constants.stringLimits["first_last_names"]
    );
    if (!/^(?=.{1,20}$)(?![\d])[\w\s]+$/.test(name)) {
      throw new Error(`${inputName} can only contain letters`);
    }
  },
  validateEmail(email, inputName) {
    this.validateStringInput(email, inputName);
    const regex =
      /^[a-zA-Z]+[\._%+\-]*[a-zA-Z0-9]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,}$/;
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
    if (!/^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
      throw new Error(
        "Password must contain at least one uppercase letter and one number"
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

    if (typeof dateAddedTo === "string" && dateAddedTo.trim().length > 0) {
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
    }

    try {
      this.validatePriority(priority);
    } catch (e) {
      errorMessages.priority = e.message;
    }

    if (typeof textBody === "string" && textBody.trim().length > 0) {
      try {
        this.validateStringInputWithMaxLength(
          textBody,
          "textBody",
          constants.stringLimits["textBody"]
        );
      } catch (e) {
        errorMessages.textBody = e.message;
      }
    } else {
      textBody = null;
    }

    if (typeof tag === "string" && tag.trim().length > 0) {
      try {
        this.validateStringInputWithMaxLength(
          tag,
          "tag",
          constants.stringLimits["tag"]
        );
      } catch (e) {
        errorMessages.tag = e.message;
      }
    } else {
      tag = constants.defaultTag;
    }

    if (
      typeof dateAddedTo === "string" &&
      typeof dateDueOn === "string" &&
      dateAddedTo.trim().length === 0 &&
      dateDueOn.trim().length > 0
    ) {
      errorMessages.dateAddedTo =
        "This field is mandatory if due date is populated";
    }

    if (
      typeof dateAddedTo === "string" &&
      typeof dateDueOn === "string" &&
      dateAddedTo.trim().length > 0 &&
      dateDueOn.trim().length === 0
    ) {
      errorMessages.dateDueOn =
        "This field is mandatory if due date is populated";
    }

    if (repeating === "true" || repeating === true) {
      if (dateAddedTo === null && dateDueOn === null) {
        if (!"dateAddedTo" in errorMessages && !"dateDueOn" in errorMessages) {
          errorMessages.dateAddedTo =
            "This field is mandatory in order to access the recurrence feature";
          errorMessages.dateDueOn =
            "This field is mandatory in order to access the recurrence feature";
        }
      }
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
    if (dateAddedTo.trim().length > 0 && dateDueOn.trim().length > 0) {
      try {
        this.validateDateRange(dateAddedTo, dateDueOn);
      } catch (error) {
        errorMessages.dateDueOn = error.message;
      }
    }

    return errorMessages;
  },

  // /**
  //  * Created for reminders to find id there are reminders that are overlapping with eachother
  //  * @param {*} startDateTime
  //  * @param {*} endDateTime
  //  * @param {*} dateTime
  //  */
  // isDateStrOverllaping(startDateTimeStr, endDateTimeStr, dateTimeStr) {
  //   let startDateTime = utils.getNewDateStr(startDateTimeStr);
  //   let endDateTime = utils.getNewDateStr(endDateTimeStr);
  //   let dateTime = utils.getNewDateStr(dateTimeStr);
  //   if (
  //     startDateTime.getMinutes() === dateTime.getMinutes() &&
  //     startDateTime.getHours() === dateTime.getHours() &&
  //     dateTime.getDate() >= startDateTime.getDate() &&
  //     dateTime.getDate() <= endDateTime.getDate() &&
  //     dateTime.getMonth() >= startDateTime.getMonth() &&
  //     dateTime.getMonth() <= endDateTime.getMonth() &&
  //     dateTime.getFullYear() >= startDateTime.getFullYear() &&
  //     dateTime.getFullYear() <= endDateTime.getFullYear()
  //   ) {
  //     return true;
  //   }
  //   return false;
  // },

  // validateDate(date, paramName) {
  //   this.validateStringInput(date, paramName);
  //   date = date.trim();
  //   date = dayjs(date).toDate();
  //   //TODO use datejs for validation
  //   if (!(date instanceof Date) || isNaN(date.getTime())) {
  //     throw new Error(`${paramName} must be a valid Date`);
  //   }
  // },
  validateDate(date, paramName) {
    if (!(this.isValidDateString(date) && dayjs(date).isValid())) {
      throw new Error(`${paramName} must be a valid Date`);
    }
  },

  //Dates are stored as string
  /**Changes Made to existing code */
  // validateDateObj(date, paramName) {
  //   if (!(date instanceof Date) || isNaN(date.getTime())) {
  //     throw new Error(`${paramName} must be a valid Date`);
  //   }
  // },

  validateAge(dob, min_age, max_age) {
    this.validateDate(dob, "dob");
    //TODO use dayjs
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
  // validateDateObj(date, paramName) {
  //   if (!(date instanceof Date) || isNaN(date.getTime())) {
  //     throw new Error(
  //       `${paramName} must be a valid Date object or a string that can be parsed as a date`
  //     );
  //   }
  // },

  // getNewDateStr(dateObj) {
  //   return `${dateObj.getMonth()}/${dateObj.getDate()}/${dateObj.getFullYear()} ${dateObj.getHours()}:${dateObj.getMinutes()}`;
  // },

  /**
   * YYYY-MM-DDTHH:mm
   * @param {*} dateTimeString
   */
  isValidDateString(dateTimeString) {
    try {
      this.validateStringInput(dateTimeString);
      let strList = dateTimeString.split("T");
      let dateStr = strList[0].split("-");
      let timeStr = strList[1].split(":");
      if (
        !(dateStr.length === 3) ||
        !(timeStr.length === 2) ||
        !(dateStr[0].length === 4) ||
        !(
          dateStr[1].length === 2 &&
          dateStr[1] >= "01" &&
          dateStr[1] <= "12"
        ) ||
        !(
          dateStr[2].length === 2 &&
          dateStr[2] >= "01" &&
          dateStr[2] <= "31"
        ) ||
        !(
          timeStr[0].length === 2 &&
          timeStr[0] >= "00" &&
          timeStr[0] <= "23"
        ) ||
        !(timeStr[1].length === 2 && timeStr[1] >= "00" && timeStr[1] <= "59")
      ) {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  },
  validateNotesInputs(title, dateAddedTo, textBody, tag) {
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
      utils.validateDate(dateAddedTo, "DateAddedTo");
    } catch (e) {
      errorMessages.dateAddedTo = e.message;
    }

    try {
      utils.validateStringInputWithMaxLength(
        tag,
        "tag",
        constants.stringLimits["tag"]
      );
    } catch (e) {
      errorMessages.tag = e.message;
    }

    try {
      const dom = new JSDOM();
      const parser = new dom.window.DOMParser();

      const doc = parser.parseFromString(textBody, "text/html");
      const text = doc.documentElement.textContent;
      utils.validateStringInputWithMaxLength(
        text,
        "textBody",
        constants.stringLimits["textBody"]
      );
    } catch (e) {
      errorMessages.textBody = e.message;
    }
    return errorMessages;
  },
  isStrArrValid(stringArr) {
    this.isOfTypeArr(stringArr);
    for (let i = 0; i < stringArr.length; i++) {
      if (!typeof stringArr[i] === "string") {
        throw new Error("Not a string");
      }
      stringArr[i] = stringArr[i].trim();
    }
  },
  isOfTypeArr(array) {
    if (
      !typeof array === "object" ||
      typeof array === null ||
      !Array.isArray(array)
    ) {
      throw new Error(`Error during applying filter condition`);
    }
  },
};

export default utils;
