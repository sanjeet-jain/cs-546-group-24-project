import { Router } from "express";
const router = Router();
import utils from "../utils/utils.js";
import meetingsDataFunctions from "../data/meetings.js";

router
  .route("/:meetingId")
  .get(async (req, res) => {
    let meetingId = "";
    try {
      if (!utils.checkObjectIdString(req.params.meetingId)) {
        throw new Error("meeting id wasnt a string");
      }
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
      if (!utils.checkObjectIdString(req.params.meetingId)) {
        throw new Error("meeting id wasnt a string");
      }
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
      if (!utils.checkObjectIdString(req.params.meetingId)) {
        throw new Error("meeting id wasnt a string");
      }
      meetingId = req.params.meetingId.trim();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const meetingsPutData = req.body;
    if (!meetingsPutData || Object.keys(meetingsPutData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    let validObject = {};
    try {
      //validation
      utils.validateMeetingUpdateInputs(
        meetingsPutData.title,
        meetingsPutData.dateAddedTo,
        meetingsPutData.dateDueOn,
        meetingsPutData.priority,
        meetingsPutData.textBody,
        meetingsPutData.tag
      );
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      const { title, dateAddedTo, dateDueOn, priority, textBody, tag } =
        meetingsPutData;
      const newBand = await meetingsDataFunctions.update(
        meetingId,
        title,
        dateAddedTo,
        dateDueOn,
        priority,
        textBody,
        tag
      );
      return res.status(200).json(newBand);
    } catch (e) {
      if (e === "Error: same object passed for update with no changes") {
        return res.status(400).json({ error: e.message });
      }
      return res.status(500).json({ error: e.message });
    }
  });

export default router;
