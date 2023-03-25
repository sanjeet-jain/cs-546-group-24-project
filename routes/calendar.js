import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.render("calendar/calendar", {
    partial: "calendar-script",
  });
});

export default router;
