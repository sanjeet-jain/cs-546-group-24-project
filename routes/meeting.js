import { Router } from "express";
const router = Router();
import utils from "../utils/utils.js";
import meetingsDataFunctions from "../data/meetings.js";

router
  .route("/:meetingId")
  .get(async (req, res) => {
    let meetingId = "";
    try {
      meetingId = helpers.validateId(req.params.meetingId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      let meeting = await meetingsDataFunctions.get(meetingId);
      return res.status(200).json(meeting);
    } catch (e) {
      return res.status(404).json({ error: "User not found" });
    }
  })
  .delete(async (req, res) => {
    let meetingId = "";
    try {
      meetingId = helpers.validateId(req.params.meetingId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      let meeting = await meetingsDataFunctions.delete(meetingId);
      return res.status(200).json(meeting);
    } catch (e) {
      return res.status(404).json({ error: "User not found" });
    }
  });

export default router;
