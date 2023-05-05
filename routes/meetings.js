import { Router } from "express";
const router = Router();
import utils from "../utils/utils.js";
import meetingsDataFunctions from "../data/meetings.js";
import xss from "xss";

router
  .route("/:userId/:meetingId")
  .get(utils.validateUserId, async (req, res) => {
    let userId = xss(req?.params?.userId?.trim());
    let meetingId = xss(req?.params?.meetingId?.trim());
    try {
      utils.checkObjectIdString(meetingId);
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
    let userId = xss(req?.params?.userId?.trim());
    let meetingId = xss(req?.params?.meetingId?.trim());

    try {
      utils.checkObjectIdString(meetingId);
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
    let userId = xss(req?.params?.userId?.trim());
    let meetingId = xss(req?.params?.meetingId?.trim());
    try {
      utils.checkObjectIdString(meetingId);
      utils.checkObjectIdString(userId);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const meetingPutData = req.body;
    if (!meetingPutData || Object.keys(meetingPutData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    meetingPutData.title = xss(meetingPutData.title);
    meetingPutData.textBody = xss(meetingPutData.textBody);
    meetingPutData.tag = xss(meetingPutData.tag);
    meetingPutData.dateAddedTo = xss(meetingPutData.dateAddedTo);
    meetingPutData.dateDueOn = xss(meetingPutData.dateDueOn);
    meetingPutData.priority = xss(meetingPutData.priority);
    meetingPutData.repeating = xss(meetingPutData.repeating);
    meetingPutData.repeatingCounterIncrement = xss(
      meetingPutData.repeatingCounterIncrement
    );
    meetingPutData.repeatingIncrementBy = xss(
      meetingPutData.repeatingIncrementBy
    );

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

router
  .route("/user/:userId")
  .get(utils.validateUserId, async (req, res) => {
    let userId = xss(req?.params?.userId?.trim());
    try {
      utils.checkObjectIdString(userId);
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
    let userId = xss(req?.params?.userId?.trim());
    try {
      utils.checkObjectIdString(userId);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    const meetingPostData = req.body;
    if (!meetingPostData || Object.keys(meetingPostData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    meetingPostData.title = xss(meetingPostData.title);
    meetingPostData.textBody = xss(meetingPostData.textBody);
    meetingPostData.tag = xss(meetingPostData.tag);
    meetingPostData.dateAddedTo = xss(meetingPostData.dateAddedTo);
    meetingPostData.dateDueOn = xss(meetingPostData.dateDueOn);
    meetingPostData.priority = xss(meetingPostData.priority);
    meetingPostData.repeating = xss(meetingPostData.repeating);
    meetingPostData.repeatingCounterIncrement = xss(
      meetingPostData.repeatingCounterIncrement
    );
    meetingPostData.repeatingIncrementBy = xss(
      meetingPostData.repeatingIncrementBy
    );

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
      return res
        .status(200)
        .json({ userId: userId, meetingId: newMeeting._id });
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
    let userId = xss(req?.params?.userId?.trim());
    let repeatingGroup = xss(req?.params?.repeatingGroup?.trim());
    try {
      utils.checkObjectIdString(userId);
      utils.checkObjectIdString(repeatingGroup);
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
    let userId = xss(req?.params?.userId?.trim());
    let repeatingGroup = xss(req?.params?.repeatingGroup?.trim());
    try {
      utils.checkObjectIdString(userId);
      utils.checkObjectIdString(repeatingGroup);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    const meetingPutData = req.body;
    if (!meetingPutData || Object.keys(meetingPutData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    meetingPutData.title = xss(meetingPutData.title);
    meetingPutData.textBody = xss(meetingPutData.textBody);
    meetingPutData.tag = xss(meetingPutData.tag);
    meetingPutData.dateAddedTo = xss(meetingPutData.dateAddedTo);
    meetingPutData.dateDueOn = xss(meetingPutData.dateDueOn);
    meetingPutData.priority = xss(meetingPutData.priority);

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
      if (e === "Meeting Details haven't Changed") {
        return res.status(400).json({ error: e.message });
      }
      return res.status(500).json({ error: e.message });
    }
  })

  .delete(utils.validateUserId, async (req, res) => {
    let userId = xss(req?.params?.userId?.trim());
    let repeatingGroup = xss(req?.params?.repeatingGroup?.trim());
    try {
      utils.checkObjectIdString(userId);
      utils.checkObjectIdString(repeatingGroup);
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
