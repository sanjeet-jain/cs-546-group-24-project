import calendarRoutes from "./calendar.js";
import meetingRoutes from "./meetings.js";
import taskRoutes from "./tasks.js";
import reminderRoutes from "./reminder.js";
import noteRoutes from "./notes.js";
import userRoutes from "./users.js";
import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import constants from "../constants/constants.js";

const constructorMethod = (app) => {
  app.use("/user", userRoutes);
  app.use("/calendar", validateUser, calendarRoutes);
  app.use("/meeting", validateUser, meetingRoutes);
  app.use("/task", validateUser, taskRoutes);
  app.use("/reminder", validateUser, reminderRoutes);
  app.use("/note", validateUser, noteRoutes);
  app.get("/about", (req, res) => {
    res.render("aboutUs", {
      title: "About Us",
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
      error: new Error("The Requested Page was not Found!"),
    });
  });
};

function validateUser(req, res, next) {
  if (!req?.session?.user) {
    return res.status(403).render("errors/error", {
      error: new Error("HTTP Error 403 : please Login"),
    });
  }
  next();
}

export default constructorMethod;
