import { Router } from "express";
const router = Router();

import usersFunctions from "../data/users.js";
import utils from "../utils/utils.js";
import constants from "../constants/constants.js";
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
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const password = req.body.password;
    const disability = req.body.disability;
    const dob = req.body.dob;
    const consent = req.body.consent;

    let errorMessages = {};
    try {
      utils.validateName(first_name, "First name");
    } catch (e) {
      errorMessages.first_name = e.message;
    }

    try {
      utils.validateName(last_name, "Last name");
    } catch (e) {
      errorMessages.last_name = e.message;
    }

    try {
      utils.validateEmail(email, "Email");
    } catch (e) {
      errorMessages.email = e.message;
    }

    try {
      utils.validatePassword(password, "Password");
    } catch (e) {
      errorMessages.password = e.message;
    }

    if (disability) {
      try {
        utils.validateBooleanInput(disability, "Disability");
      } catch (e) {
        errorMessages.disability = e.message;
      }
    }
    try {
      utils.validateDate(dob, "Date of Birth");
    } catch (e) {
      errorMessages.dob = e.message;
    }
    try {
      utils.validateAge(dob, constants.min_age, constants.max_age);
    } catch (e) {
      errorMessages.dob = e.message;
    }

    try {
      utils.validateBooleanInput(consent, "Consent");
    } catch (e) {
      errorMessages.consent = e.message;
    }

    if (Object.keys(errorMessages).length !== 0) {
      return res.status(400).render("user/signup", {
        errorMessages: errorMessages,
        is_invalid: true,
        errorContent: req.body,
      });
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
      return res.status(200).redirect("/calendar");
    } catch (e) {
      return res.render("user/signup", { error: e.message });
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
    let email = req.body.email;
    let password = req.body.password;

    if (req.session.user) {
      return res.redirect("/calendar");
    }
    try {
      utils.validateEmail(email);
      utils.validatePassword(password);
    } catch (e) {
      return res.status(400).render("user/login", {
        errorMessage: "Invalid email and password",
        is_invalid: true,
        errorContent: req.body,
      });
    }

    //try checkuser
    try {
      email = email.trim().toLowerCase();
      password = password.trim();
      const user = await usersFunctions.loginUser(email, password);
      if (user) {
        req.session.user = createSessionObject(user);
        return res.redirect("/calendar");
      } else {
        return res.status(500).render("user/login", {
          errorMessage:
            "Something went wrong on the server, please try again later",
          is_invalid: true,
          errorContent: req.body,
        });
      }
    } catch (e) {
      return res.status(400).render("user/login", {
        errorMessage: "Invalid email and password",
        is_invalid: true,
        errorContent: req.body,
      });
    }
  })
  .get(async (req, res) => {
    if (req.session.user) {
      return res.redirect("/calendar");
    }
    res.render("user/login");
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
      }
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });
router
  .route("/profile/edit")
  .get(async (req, res) => {
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
    const id = req.session.user.user_id;
    try {
      const updated = usersFunctions.changePassword(id, req.body.password);
      return res.redirect("/profile");
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  })
  .get(async (req, res) => {
    if (req.session.user) {
      return res.redirect("/calendar");
    }
    //TODO password change UI
    res.redirect("/");
  });
router.route("/logout").post(async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
export default router;
