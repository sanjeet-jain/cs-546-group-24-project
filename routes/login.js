import { Router } from "express";
const router = Router();

router
  .route("/")
  .get((req, res) => {
    res.render("login", {});
  })
  .post((req, res) => {});

export default router;
