import express from "express";
const app = express();
import session from "express-session";
import cookieParser from "cookie-parser";
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

app.use(express.json());
app.use(
  session({
    name: "AuthCookie",
    secret: "CS546",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 60000 },
  })
);

app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.session = req.session.user;
  }
  next();
});

app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
