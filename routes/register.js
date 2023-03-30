import { Router } from "express";
const router = Router();

router
  .route("/")
  .get((req, res) => {
    //if first time then send userName as blank
    res.render("register", { userName: "" });
  })
  //do login post here
  .post((req, res) => {});

export default router;
