import { Router } from "express";
const router = Router();
import utils from "../utils/utils.js";
import meetingsDataFunctions from "../data/meetings.js";
import dayjs from "dayjs";
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
        repeatingIncrementBy
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
  .put(utils.validateUserId, async (req, res) => {
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
    let errorMessages = utils.validateMeetingCreateInputs(
      meetingPutData.title,
      meetingPutData.dateAddedTo,
      meetingPutData.dateDueOn,
      meetingPutData.priority,
      meetingPutData.textBody,
      meetingPutData.tag
    );

    if (Object.keys(errorMessages).length !== 0) {
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
      if (e === "Meeting Details havent Changed") {
        return res.status(400).json({ error: e.message });
      }
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
  .route("/:userId/:meetingId/dateAddedto")
  .put(utils.validateUserId, async (req, res) => {
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
    let dateAddedTo = dayjs(req?.body?.dateAddedTo).format("YYYY-MM-DDTHH:mm");
    const meetingPutData = await meetingsDataFunctions.get(userId, meetingId);
    meetingPutData.dateAddedTo = dateAddedTo;
    meetingPutData.dateDueOn = dayjs(dateAddedTo)
      .add(1, "hour")
      .format("YYYY-MM-DDTHH:mm");
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
        repeatingIncrementBy
      );
      return res.status(200).json({ userId: userId, meetingId: meetingId });
    } catch (e) {
      if (e === "Meeting Details havent Changed") {
        return res.status(400).json({ error: e.message });
      }
      return res.status(500).json({ error: e.message });
    }
  });
export default router;
