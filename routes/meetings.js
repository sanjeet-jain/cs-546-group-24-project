import { Router } from "express";
const router = Router();
import utils from "../utils/utils.js";
import meetingsDataFunctions from "../data/meetings.js";

router
  .route("/meeting/:meetingId")
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
    try {
      utils.checkObjectIdString(req.params.meetingId);
      meetingId = req.params.meetingId.trim();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const meetingPutData = req.body;
    if (!meetingPutData || Object.keys(meetingPutData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    try {
      //validation
      utils.validateMeetingUpdateInputs(
        meetingPutData.title,
        meetingPutData.dateAddedTo,
        meetingPutData.dateDueOn,
        meetingPutData.priority,
        meetingPutData.textBody,
        meetingPutData.tag
      );
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      const { title, dateAddedTo, dateDueOn, priority, textBody, tag } =
        meetingPutData;
      const updatedMeeting = await meetingsDataFunctions.update(
        meetingId,
        title,
        dateAddedTo,
        dateDueOn,
        priority,
        textBody,
        tag
      );
      return res.status(200).json(updatedMeeting);
    } catch (e) {
      if (e === "Error: same object passed for update with no changes") {
        return res.status(400).json({ error: e.message });
      }
      return res.status(500).json({ error: e.message });
    }
  });

router
  .route("/user/:userId/meetings/")
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
    try {
      //validation
      utils.validateMeetingCreateInputs(
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
    } catch (e) {
      return res.status(400).json({ error: e.message });
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
      return res.status(200).json(newMeeting);
    } catch (e) {
      if (e === "Error: same object passed for update with no changes") {
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
    try {
      //validation
      utils.validateMeetingUpdateAllRecurrencesInputs(
        meetingPutData.title,
        meetingPutData.dateAddedTo,
        meetingPutData.dateDueOn,
        meetingPutData.priority,
        meetingPutData.textBody,
        meetingPutData.tag
      );
    } catch (e) {
      return res.status(400).json({ error: e.message });
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
      return res.status(200).json(updatedMeeting);
    } catch (e) {
      if (e === "Error: same object passed for update with no changes") {
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
