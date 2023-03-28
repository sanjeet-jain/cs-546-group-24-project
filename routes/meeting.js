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
  });

export default router;
