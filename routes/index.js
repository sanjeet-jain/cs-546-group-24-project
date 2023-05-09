import calendarRoutes from "./calendar.js";
import meetingRoutes from "./meetings.js";
import taskRoutes from "./tasks.js";
import reminderRoutes from "./reminder.js";
import noteRoutes from "./notes.js";
import userRoutes from "./users.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const constructorMethod = (app) => {
  app.get("/firstLogin", validateUser, (req, res, next) => {
    if (res.locals?.session?.firstTimeLogin === true) {
      res.locals.session.firstTimeLogin = false;
    }
    return res.status(200).json();
  });
  app.use("/user", userRoutes);
  app.use("/calendar", validateUser, calendarRoutes);
  app.use("/meeting", validateUser, meetingRoutes);
  app.use("/task", validateUser, taskRoutes);
  app.use("/reminder", validateUser, reminderRoutes);
  app.use("/notes", validateUser, noteRoutes);

  app.get("/contact", (req, res) => {
    res.render("contact", {
      title: "Contact Us",
    });
  });
  app.get("/about", (req, res) => {
    res.render("aboutUs", {
      title: "About Us",
    });
  });
  app.get("/forgot", (req, res) => {
    res.render("forgot", {
      title: "Forgot Password",
    });
  });
  app.get("/", (req, res) => {
    res.render("aboutUs", {
      title: "About Us",
    });
  });
  app.use("*", (req, res) => {
    // we can set this to check for authorization and then send back to correct page !
    res.status(404).render("errors/error", {
      title: "Error",
      error: new Error("The Requested Page was not Found!"),
    });
  });
};

function validateUser(req, res, next) {
  if (!req?.session?.user) {
    return res.status(403).render("errors/error", {
      title: "Error",
      error: new Error("HTTP Error 403 : please Login"),
    });
  }
  next();
}

export default constructorMethod;
