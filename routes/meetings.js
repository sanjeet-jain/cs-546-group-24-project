import { Router } from "express";
const router = Router();
import utils from "../utils/utils.js";
import meetingsDataFunctions from "../data/meetings.js";
import dayjs from "dayjs";
import xss from "xss";
router
  .route("/:userId/:meetingId")
  .get(utils.validateUserId, async (req, res) => {
    let userId = req.params.userId.trim();
    let meetingId = "";
    try {
      utils.checkObjectIdString(req.params.meetingId);
      meetingId = req.params.meetingId.trim();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      let meeting = await meetingsDataFunctions.get(userId, meetingId);
      return res.status(200).json(meeting);
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  })
  .delete(utils.validateUserId, async (req, res) => {
    let meetingId = "";
    let userId = req.params.userId.trim();

    try {
      utils.checkObjectIdString(req.params.meetingId);
      meetingId = req.params.meetingId.trim();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      let meeting = await meetingsDataFunctions.delete(meetingId, userId);
      return res.status(200).json(meeting);
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  })
  .put(utils.validateUserId, async (req, res) => {
    //code here for PUT
    let meetingId = "";
    let userId = "";
    try {
      utils.checkObjectIdString(req.params.meetingId);
      utils.checkObjectIdString(req.params.userId);
      meetingId = req.params.meetingId.trim();
      userId = req.params.userId.trim();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const meetingPutData = req.body;
    if (!meetingPutData || Object.keys(meetingPutData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    //validation
    let errorMessages = utils.validateMeetingCreateInputs(
      meetingPutData.title,
      meetingPutData.dateAddedTo,
      meetingPutData.dateDueOn,
      meetingPutData.priority,
      meetingPutData.textBody,
      meetingPutData.tag,
      meetingPutData.repeating,
      meetingPutData.repeatingCounterIncrement,
      meetingPutData.repeatingIncrementBy
    );
    let updateAll =
      xss(meetingPutData.updateAll).trim() === ""
        ? false
        : xss(meetingPutData.updateAll).trim();
    try {
      updateAll = utils.validateBooleanInput(updateAll);
    } catch (e) {
      errorMessages.updateAll = e.message;
    }

    if (Object.keys(errorMessages).length !== 0) {
      return res.status(400).json({ errorMessages: errorMessages });
    }
    try {
      const {
        title,
        dateAddedTo,
        dateDueOn,
        priority,
        textBody,
        tag,
        repeating,
        repeatingCounterIncrement,
        repeatingIncrementBy,
      } = meetingPutData;
      //TODO add user id to route
      const updatedMeeting = await meetingsDataFunctions.update(
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
        updateAll
      );
      return res.status(200).json({ userId: userId, meetingId: meetingId });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  });

router
  .route("/user/:userId")
  .get(utils.validateUserId, async (req, res) => {
    let userId = "";
    try {
      utils.checkObjectIdString(req.params.userId);
      userId = req.params.userId.trim();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      let meetings = await meetingsDataFunctions.getAll(userId);
      return res.status(200).json(meetings);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  })
  .post(utils.validateUserId, async (req, res) => {
    let userId = "";
    try {
      utils.checkObjectIdString(req.params.userId);
      userId = req.params.userId.trim();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    const meetingPostData = req.body;
    if (!meetingPostData || Object.keys(meetingPostData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    //validation
    let errorMessages = utils.validateMeetingCreateInputs(
      meetingPostData.title,
      meetingPostData.dateAddedTo,
      meetingPostData.dateDueOn,
      meetingPostData.priority,
      meetingPostData.textBody,
      meetingPostData.tag,
      meetingPostData.repeating,
      meetingPostData.repeatingCounterIncrement,
      meetingPostData.repeatingIncrementBy
    );
    if (Object.keys(errorMessages).length !== 0) {
      return res.status(400).json({ errorMessages: errorMessages });
    }

    try {
      const {
        title,
        dateAddedTo,
        dateDueOn,
        priority,
        textBody,
        tag,
        repeating,
        repeatingCounterIncrement,
        repeatingIncrementBy,
      } = meetingPostData;
      const newMeeting = await meetingsDataFunctions.create(
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
      );
      return res.status(200).json({ userId: userId });
    } catch (e) {
      if (e === "Meeting Details havent Changed") {
        return res.status(400).json({ error: e.message });
      }
      return res.status(500).json({ error: e.message });
    }
  });

router
  .route("/user/:userId/meetings/repeating/:repeatingGroup")
  .get(utils.validateUserId, async (req, res) => {
    let userId = "";
    let repeatingGroup = "";
    try {
      utils.checkObjectIdString(req.params.userId);
      utils.checkObjectIdString(req.params.repeatingGroup);
      userId = req.params.userId.trim();
      repeatingGroup = req.params.repeatingGroup.trim();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      let meetingsRecurring = await meetingsDataFunctions.getAllRecurrences(
        userId,
        repeatingGroup
      );
      return res.status(200).json(meetingsRecurring);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  })

  .delete(utils.validateUserId, async (req, res) => {
    let userId = "";
    let repeatingGroup = "";
    try {
      utils.checkObjectIdString(req.params.userId);
      utils.checkObjectIdString(req.params.repeatingGroup);
      userId = req.params.userId.trim();
      repeatingGroup = req.params.repeatingGroup.trim();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    try {
      const result = await meetingsDataFunctions.deleteAllRecurrences(
        userId,
        repeatingGroup
      );
      if (result.deletedCount > 0) {
        return res
          .status(200)
          .json({ message: "Meetings deleted successfully" });
      } else {
        return res.status(404).json({ error: "No meetings found to delete" });
      }
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });

router
  .route("/:userId/:meetingId/dateAddedTo")
  .put(utils.validateUserId, async (req, res) => {
    let meetingId = "";
    let userId = "";
    try {
      utils.checkObjectIdString(xss(req.params.meetingId));
      utils.checkObjectIdString(xss(req.params.userId));
      meetingId = xss(req.params.meetingId.trim());
      userId = xss(req.params.userId.trim());
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    //TODO check if dateAddedTO is ever an empty stirng if it is then error
    let dateAddedTo = xss(req?.body?.dateAddedTo).trim();
    if (dateAddedTo === "") {
      return res.status(400).json({ error: e.message });
    }
    dateAddedTo = dayjs(dateAddedTo).format("YYYY-MM-DDTHH:mm");
    try {
      utils.checkIfDateIsBeyondRange(dateAddedTo);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    const meetingPutData = await meetingsDataFunctions.get(userId, meetingId);
    let previousDate = meetingPutData.dateAddedTo;
    meetingPutData.dateAddedTo = dateAddedTo;
    if (!previousDate) {
      meetingPutData.dateDueOn = dayjs(dateAddedTo)
        .add(30, "minute")
        .format("YYYY-MM-DDTHH:mm");
    } else {
      previousDate = dayjs(previousDate).format("YYYY-M-D");
      meetingPutData.dateDueOn = dayjs(meetingPutData.dateDueOn)
        .date(dayjs(dateAddedTo).date())
        .month(dayjs(dateAddedTo).month())
        .year(dayjs(dateAddedTo).year())
        .add(
          dayjs(meetingPutData.dateDueOn).diff(dayjs(previousDate)),
          "millisecond"
        )
        .format("YYYY-MM-DDTHH:mm");
    }

    //validation
    let errorMessages = utils.validateMeetingCreateInputs(
      meetingPutData.title,
      meetingPutData.dateAddedTo,
      meetingPutData.dateDueOn,
      meetingPutData.priority,
      meetingPutData.textBody,
      meetingPutData.tag,
      meetingPutData.repeating,
      meetingPutData.repeatingCounterIncrement,
      meetingPutData.repeatingIncrementBy
    );

    if (Object.keys(errorMessages).length !== 0) {
      return res.status(400).json({ errorMessages: errorMessages });
    }
    try {
      const updatedMeeting = await meetingsDataFunctions.update(
        userId,
        meetingId,
        meetingPutData.title,
        meetingPutData.dateAddedTo,
        meetingPutData.dateDueOn,
        meetingPutData.priority,
        meetingPutData.textBody,
        meetingPutData.tag,
        meetingPutData.repeating,
        meetingPutData.repeatingCounterIncrement,
        meetingPutData.repeatingIncrementBy
      );
      return res
        .status(200)
        .json({ userId: userId, meetingId: meetingId, previousDate });
    } catch (e) {
      if (e === "Meeting Details havent Changed") {
        return res.status(400).json({ error: e.message });
      }
      return res.status(500).json({ error: e.message });
    }
  });
export default router;
