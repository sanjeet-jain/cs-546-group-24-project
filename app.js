import express from "express";
const app = express();
import configRoutes from "./routes/index.js";

import exphbs from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  partialsDir: ["views/partials/"],
  helpers: {
    eq: function (a, b) {
      return a === b;
    },
    currDate: function () {
      return new Date().toISOString().slice(0, 10);
    },
    minDobDate: function () {
      return new Date(new Date().getFullYear() - 14, 0, 1)
        .toISOString()
        .slice(0, 10);
    },
    maxDobDate: function () {
      return new Date(new Date().getFullYear() - 100, 0, 1)
        .toISOString()
        .slice(0, 10);
    },
  },
});

app.use("/public", express.static(path.join(__dirname, "/public")));
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "/node_modules/bootstrap/dist"))
);
app.use(
  "/bootstrap-icons",
  express.static(path.join(__dirname, "/node_modules/bootstrap-icons/"))
);

app.use(
  "/jquery",
  express.static(path.join(__dirname, "/node_modules/jquery/dist/"))
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
