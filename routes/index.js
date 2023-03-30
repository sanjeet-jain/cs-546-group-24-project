import calendarRoutes from "./calendar.js";
import meetingRoutes from "./meetings.js";
import loginRoutes from "./login.js";
import registerRoutes from "./register.js";
import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const constructorMethod = (app) => {
  app.use("/login", loginRoutes);
  app.use("/register", registerRoutes);
  app.use("/calendar", calendarRoutes);
  app.use("/meeting", meetingRoutes);
  app.get("/about", (req, res) => {
    res.render("aboutUs");
  });
  app.get("/", (req, res) => {
    res.render("aboutUs");
  });
  app.use("*", (req, res) => {
    // we can set this to check for authorization and then send back to correct page !
    const error = { error: "The Requested Page was not Found!" };
    res.status(404).render("errors/error", { error: error });
  });
};

export default constructorMethod;
