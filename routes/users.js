import { Router } from "express";
const router = Router();

import usersFunctions from "../data/users.js";
import utils from "../utils/utils.js";
import bcrypt from "bcrypt";
import { usersCollection } from "../config/mongoCollections.js";

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
      errorMessages.first_name = "Please enter a valid first name.";
    }

    try {
      utils.validateName(last_name, "Last name");
    } catch (e) {
      errorMessages.last_name = "Please enter a valid last name.";
    }

    try {
      utils.validateEmail(email, "Email");
    } catch (e) {
      errorMessages.email = "Please enter a valid email.";
    }

    try {
      utils.validatePassword(password, "Password");
    } catch (e) {
      errorMessages.password =
        "Password must be at least 8 characters, contain at least one uppercase letter, and one digit.";
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
      errorMessages.dob = "Please enter a valid date of birth.";
    }
    if (!errorMessages.dob) {
      try {
        utils.validateAge(dob, constants.min_age, constants.max_age);
      } catch (e) {
        errorMessages.dob = e.message;
      }
    }

    try {
      utils.validateBooleanInput(consent, "Consent");
    } catch (e) {
      errorMessages.consent = "Please consent to data collection";
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
      return res.status(404).render("user/signup", {
        error: "Something went wrong, please try again later",
        errorContent: req.body,
      });
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
    let errorMessages = {};
    try {
      utils.validateEmail(email);
    } catch (e) {
      errorMessages.email = "Please enter a valid email.";
    }

    try {
      utils.validatePassword(password);
    } catch (e) {
      errorMessages.password =
        "Password must be at least 8 characters, contain at least one uppercase letter, and one digit.";
    }

    if (Object.keys(errorMessages).length !== 0) {
      return res.status(400).render("user/login", {
        errorMessages: errorMessages,
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
          error: "Something went wrong on the server, please try again later",
          is_invalid: true,
          errorContent: req.body,
        });
      }
    } catch (e) {
      return res.status(400).render("user/login", {
        error: "Invalid Credentials",
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

  .get(async (req, res) => {
    try {
      if (req.session.user) {
        const id = req.session.user.user_id;
        const currUser = await usersFunctions.getUser(id);

        return res.render("user/profile", { currUser });
      }
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });

router
  .route("/edit")
  .get(async (req, res) => {
    if (!req.session.user) {
      res.render("user/login");
    } else {
      const id = req.session.user.user_id;
      try {
        const currUser = await usersFunctions.getUser(id);

        return res.render("user/edit", { currUser });
      } catch (e) {
        return res.status(400).json({ error: e.message });
      }
    }
  })
  .post(async (req, res) => {
    if (!req.session.user) {
      res.render("user/login");
    } else {
      const id = req.session.user.user_id;
      const first_name = req.body.first_name;
      const last_name = req.body.last_name;
      const email = req.body.email;
      const disability = req.body.disability;
      const dob = req.body.dob;
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
        errorMessages.dob = "Please enter a valid date of birth.";
      }

      if (Object.keys(errorMessages).length !== 0) {
        return res.status(400).render("user/edit", {
          errorMessages: errorMessages,
          is_invalid: true,
          errorContent: req.body,
        });
      }

      try {
        await usersFunctions.updateUser(id, {
          first_name,
          last_name,
          email,
          disability,
          dob,
        });
      } catch (e) {
        return res.status(400).json({ error: e.message });
      }
      return res.redirect("profile");
    }
  });
router
  .route("/password")
  .get(async (req, res) => {
    if (req.session.user) {
      return res.render("user/password");
    }

    res.redirect("/");
  })
  .post(async (req, res) => {
    let errorMessages = {};

    if (!req?.session?.user || !req.session.user.user_id) {
      return res.render("user/login");
    }
    let id = req.session.user.user_id;
    let oldPassword = req?.body?.oldPassword;
    let newPassword = req?.body?.newPassword;
    let reEnterNewPassword = req?.body?.reEnterNewPassword;

    try {
      utils.validatePassword(oldPassword);
    } catch (e) {
      errorMessages.oldPassword =
        "New password must be at least 8 characters, contain at least one uppercase letter, and one digit.";
    }
    try {
      utils.validatePassword(newPassword);
    } catch (e) {
      errorMessages.newPassword =
        "New password must be at least 8 characters, contain at least one uppercase letter, and one digit.";
    }
    try {
      utils.validatePassword(reEnterNewPassword);
    } catch (e) {
      errorMessages.reEnterNewPassword =
        "New password must be at least 8 characters, contain at least one uppercase letter, and one digit.";
    }

    //trim the validated passwords
    newPassword = newPassword.trim();
    reEnterNewPassword = reEnterNewPassword.trim();
    oldPassword = oldPassword.trim();

    if (newPassword !== reEnterNewPassword) {
      errorMessages.reEnterNewPassword =
        "Re-Entered password does not match new password.";
    }
    if (
      errorMessages?.oldPassword ||
      errorMessages?.newPassword ||
      errorMessages?.reEnterNewPassword
    ) {
      return res.status(400).render("user/password", {
        errorMessages: errorMessages,
        is_invalid: true,
        errorContent: req.body,
      });
    }
    const currUser = await usersFunctions.getUser(id);
    const isSamePassword = await bcrypt.compare(newPassword, currUser.password);
    const oldPassCheck = await bcrypt.compare(oldPassword, currUser.password);
    if (isSamePassword) {
      errorMessages.newPassword =
        "New password must be different from current password";
    }
    if (!oldPassCheck) {
      errorMessages.oldPassword = "Current password is incorrect";
    }
    if (Object.keys(errorMessages).length !== 0) {
      return res.status(400).render("user/password", {
        errorMessages: errorMessages,
        is_invalid: true,
        errorContent: req.body,
      });
    }
    try {
      utils.checkObjectIdString(id);
      id = id.trim();
      await usersFunctions.changePassword(
        req.session.user.user_id,
        req.body.oldPassword,
        req.body.newPassword,
        req.body.reEnterNewPassword
      );
      return res.status(200).redirect("user/password", {
        success: "password successfully changed",
      });
    } catch (e) {
      return res.status(500).render("user/password", {
        error: "error changing password ",
        is_invalid: true,
      });
    }
  });

router.route("/logout").post(async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
export default router;
