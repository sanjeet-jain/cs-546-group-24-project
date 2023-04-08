import { Router } from "express";
const router = Router();
import constants from "./../constants/constants.js";
import axios from "axios";
import utils from "../utils/utils.js";

router.route("/all/:userId").get(async (req, res) => {
  const userId = req?.params?.userId;
  utils.checkObjectIdString(userId);
  try {
    const response = await axios.get(
      `http://localhost:3000/meeting/user/${userId}/meetings/`,
      {
        headers: {
          Cookie: req.headers.cookie,
        },
      }
    );
    const meetings = response.data;
    console.log(meetings);
    const result = { userId: userId, meetings: meetings };
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

export default router;
