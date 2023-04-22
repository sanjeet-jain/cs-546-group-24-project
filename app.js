import express from "express";
const app = express();
import session from "express-session";
import cookieParser from "cookie-parser";
import configRoutes from "./routes/index.js";

import exphbs from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as path from "path";
import dayjs from "dayjs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  layoutsDir: "views/layouts",
  partialsDir: ["views/partials/", "views/partials/modals"],
  helpers: {
    eq: function (a, b) {
      return a === b;
    },
    checkIfToday: function (year, month, date) {
      const today = new Date();
      return (
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === date
      );
    },
    minDobDate: function () {
      return dayjs(new Date(new Date().getFullYear() - 14, 0, 1)).format(
        "YYYY-MM-DD"
      );
    },
    maxDobDate: function () {
      return dayjs(new Date(new Date().getFullYear() - 100, 0, 1)).format(
        "YYYY-MM-DD"
      );
    },
    json: function (context) {
      return JSON.stringify(context);
    },
    includes: function (array, itemToCheck) {
      return array.includes(itemToCheck);
    },
  },
});
const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

app.use("/public", express.static(path.join(__dirname, "/public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.use(
  session({
    name: "AuthCookie",
    secret: "CS546",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1.8e6 },
  })
);

app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.session = req.session.user;
    //todo extend cookie
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
