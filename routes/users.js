import { Router } from "express";
const router = Router();

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
    if (req.session.user) {
      return res.redirect("/calendar/month");
    }
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const password = req.body.password;
    const disability = req.body.disability;
    const dob = req.body.dob;
    const consent = req.body.consent;
    try {
      utils.validateName(first_name, "First name");
      utils.validateName(last_name, "Last name");
      utils.validateEmail(email, "Email");
      utils.validatePassword(password, "Password");
      utils.validateBooleanInput(disability, "Disability");
      utils.validateDate(dob, "Date of Birth");
      utils.validateBooleanInput(consent, "Consent");
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    try {
      const newUser = await usersFunctions.create(
        first_name,
        last_name,
        email,
        password,
        disability,
        dob,
        consent
      );
      const user = await usersFunctions.loginUser(email, password);
      if (user) {
        req.session.user = createSessionObject(user);
      }
      return res.status(200).redirect("/calendar/month");
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  })
  .get(async (req, res) => {
    if (req.session.user) {
      return res.redirect("/calendar/month");
    }
    res.render("user/signup", {
      title: "SignUp",
    });
  });

router
  .route("/login")
  .post(async (req, res) => {
    if (req.session.user) {
      return res.redirect("/calendar/month");
    }
    let email = req.body.email;
    let password = req.body.password;

    try {
      utils.validateEmail(email);
      utils.validatePassword(password);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    //try checkuser
    try {
      email = email.trim().toLowerCase();
      password = password.trim();
      const user = await usersFunctions.loginUser(email, password);
      if (user) {
        req.session.user = createSessionObject(user);
        return res.redirect("/calendar/month");
      } else {
        return res.status(500).json({ error: e.message });
      }
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  })
  .get(async (req, res) => {
    if (req.session.user) {
      return res.redirect("/calendar/month");
    }
    res.render("user/login", {
      title: "Login",
    });
  });
router
  .route("/profile")
  //TODO: choose how to display user details
  .put(async (req, res) => {
    try {
      if (req.session.user) {
        const users = await usersCollection();
        const id = req.session.user.user_id;
        const currUser = users.getUsers(id);
        //TODO render handlebar
        return res.status(200).json(currUser);
      } else {
        return res.redirect("/user/login");
      }
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });
router
  .route("/profile/edit")
  .get(async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/user/login");
    }
    const id = req.session.user.user_id;
    try {
      const currUser = await usersFunctions.getUser(id);
      //TODO render handlebar
      return res.status(200).json(currUser);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  })
  .put(async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/user/login");
    }
    const id = req.session.user.user_id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const disability = req.body.disability;
    const dob = req.body.dob;

    try {
      utils.checkObjectIdString(id);
      utils.validateName(first_name);
      utils.validateName(last_name);
      utils.validateEmail(email);
      utils.validateBooleanInput(disability);
      utils.validateDate(dob);
    } catch (e) {
      return res(400).json({ error: e.message });
    }
    try {
      const updatedUser = usersFunctions.updateUser(id, {
        first_name,
        last_name,
        email,
        disability,
        dob,
      });
      return res.redirect("/profile");
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  });
router
  .route("/profile/password")
  .put(async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/user/login");
    }
    const id = req.session.user.user_id;
    try {
      const updated = usersFunctions.changePassword(id, req.body.password);
      return res.redirect("/profile");
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  })
  .get(async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/user/login");
    }
    //TODO password change UI
    res.redirect("/");
  });
router.route("/logout").get(async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/user/login");
  }
  req.session.destroy();
  res.redirect("/user/login");
});
export default router;
