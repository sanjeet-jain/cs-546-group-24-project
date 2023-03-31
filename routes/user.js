import { Router } from "express";
const router = Router();

router.route("/login").get(async (req, res) => {
  res.render("user/login", { userName: "", sample: "login-script" });
});

router.route("/register").get(async (req, res) => {
  res.render("user/register");
});

export default router;
