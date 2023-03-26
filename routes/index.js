import calendarRoutes from "./calendar.js";
import sampleRoutes from "./sample.js";
import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const constructorMethod = (app) => {
  app.use("/calendar", calendarRoutes);
  app.use("/sample", sampleRoutes);

  app.use("*", (req, res) => {
    // we can set this to check for authorization and then send back to correct page !
    res.redirect("/calendar");
  });
};

export default constructorMethod;
