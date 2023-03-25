import { Router } from "express";
const router = Router();
import constants from "./../constants/constants.js";

router.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.render("calendar/calendar", {
    partial: "calendar-script",
    weekdays: constants.weekdays,
  });
});

export default router;
