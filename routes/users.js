import { Router } from "express";
const router = Router();
import { ObjectId } from "mongodb";

import usersFunctions from "../data/users.js";
import utils from "../utils/utils.js";

function createSessionObject(user) {
  return {
    user_id: user._id.toString(),
    userFirstName: user.first_name,
    email: user.email,
  };
}

router
  .route("/signup")
  .post(async (req, res) => {
    //validate
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const password = req.body.password;
    const Disability = req.body.Disability;
    const Dob = req.body.Dob;
    const Consent = req.body.Consent;

    if (req.session.user) {
      return res.redirect("/calendar");
    }
    try {
      const newUser = await usersFunctions.create(
        first_name,
        last_name,
        email,
        password,
        Disability,
        Dob,
        Consent
      );
      const user = await usersFunctions.loginUser(email, password);
      if (user) {
        req.session.user = createSessionObject(user);
      }
      return res.status(200).redirect("/calendar");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  })
  .get(async (req, res) => {
    if (req.session.user) {
      return res.redirect("/calendar");
    }
    res.render("user/signup");
  });
router
  .route("/login")
  .post(async (req, res) => {
    //validate request body
    const email = req.body.email;
    const password = req.body.password;

    if (req.session.user) {
      return res.redirect("/calendar");
    }
    try {
      utils.validateEmail(email);
      utils.validatePassword(password);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    //try checkuser
    try {
      const user = await usersFunctions.loginUser(email, password);

      if (user) {
        req.session.user = createSessionObject(user);
        return res.redirect("/calendar");
      }
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  })
  .get(async (req, res) => {
    if (req.session.user) {
      return res.redirect("/calendar");
    }
    res.render("user/login");
  });
router.route("/profile").put(async (req, res) => {});
//TODO
router.route("/password").post(async (req, res) => {});

//TODO
export default router;
