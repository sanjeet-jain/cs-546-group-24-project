import { Router } from "express";
const router = Router();

router.route("/").get((req, res) => {
  res.render("calendar/sample", {
    partial: "calendar-script",
  });
});

export default router;
