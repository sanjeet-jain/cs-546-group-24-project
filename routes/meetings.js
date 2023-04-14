import { Router } from "express";
const router = Router();
import utils from "../utils/utils.js";
import meetingsDataFunctions from "../data/meetings.js";

router
  .route("/:userId/:meetingId")
  .get(async (req, res) => {
    let meetingId = "";
    try {
      utils.checkObjectIdString(req.params.meetingId);
      meetingId = req.params.meetingId.trim();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      let meeting = await meetingsDataFunctions.get(meetingId);
      return res.status(200).json(meeting);
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  })
  .delete(async (req, res) => {
    let meetingId = "";
    try {
      utils.checkObjectIdString(req.params.meetingId);
      meetingId = req.params.meetingId.trim();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      let meeting = await meetingsDataFunctions.delete(meetingId);
      return res.status(200).json(meeting);
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  })
  .put(async (req, res) => {
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
    let errorMessages = utils.validateMeetingUpdateInputs(
      title,
      dateAddedTo,
      dateDueOn,
      priority,
      textBody,
      tag
    );

    if (Object.keys(errorMessages) !== 0) {
      return res.status(400).json({ errorMessages: errorMessages });
    }
    try {
      const { title, dateAddedTo, dateDueOn, priority, textBody, tag } =
        meetingPutData;
      //TODO add user id to route
      const updatedMeeting = await meetingsDataFunctions.update(
        meetingId,
        title,
        dateAddedTo,
        dateDueOn,
        priority,
        textBody,
        tag
      );
      return res.status(200).json({ userId: userId, meetingId: meetingId });
    } catch (e) {
      if (e === "Error: Meeting Details havent Changed") {
        return res.status(400).json({ error: e.message });
      }
      return res.status(500).json({ error: e.message });
    }
  });

router
  .route("/user/:userId")
  .get(async (req, res) => {
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
  .post(async (req, res) => {
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
    if (Object.keys(errorMessages) !== 0) {
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
      return res
        .status(200)
        .json({ userId: userId, meetingId: newMeeting._id });
    } catch (e) {
      if (e === "Error: Meeting Details havent Changed") {
        return res.status(400).json({ error: e.message });
      }
      return res.status(500).json({ error: e.message });
    }
  });

router
  .route("/user/:userId/meetings/repeating/:repeatingGroup")
  .get(async (req, res) => {
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
  .put(async (req, res) => {
    //code here for PUT
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

    const meetingPutData = req.body;
    if (!meetingPutData || Object.keys(meetingPutData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    let errorMessages = utils.validateMeetingUpdateInputs(
      title,
      dateAddedTo,
      dateDueOn,
      priority,
      textBody,
      tag
    );

    if (Object.keys(errorMessages) !== 0) {
      return res.status(400).json({ errorMessages: errorMessages });
    }
    try {
      const { title, dateAddedTo, dateDueOn, priority, textBody, tag } =
        meetingPutData;
      const updatedMeeting = await meetingsDataFunctions.updateAllRecurrences(
        userId,
        title,
        dateAddedTo,
        dateDueOn,
        priority,
        textBody,
        tag,
        repeatingGroup
      );
      return res
        .status(200)
        .json({ userId: userId, repeatingGroup: repeatingGroup });
    } catch (e) {
      if (e === "Error: Meeting Details havent Changed") {
        return res.status(400).json({ error: e.message });
      }
      return res.status(500).json({ error: e.message });
    }
  })
  .delete(async (req, res) => {
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
export default router;
