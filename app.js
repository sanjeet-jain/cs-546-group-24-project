import express from "express";
const app = express();
import session from "express-session";
import configRoutes from "./routes/index.js";

import exphbs from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as path from "path";
import dayjs from "dayjs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import cron from "node-cron";

import constants from "./constants/constants.js";
import * as collections from "./config/mongoCollections.js";

//can be reduced to an an hour by setting it as "0 * * * * *"
cron.schedule("*/1 * * * *", async () => {
  const currentDate = dayjs().format("YYYY-MM-DDTHH:mm");
  const meetingsCollection = await collections.meetingsCollection();
  const remindersCollection = await collections.remindersCollection();
  const tasksCollection = await collections.tasksCollection();
  const updateResultmeetings = await meetingsCollection.updateMany(
    {
      dateDueOn: { $ne: null, $ne: undefined },
      dateDueOn: { $lte: currentDate },
      expired: { $ne: true },
    },
    { $set: { expired: true } }
  );
  const updateResultreminders = await remindersCollection.updateMany(
    {
      dateAddedTo: { $ne: null, $ne: undefined },
      dateAddedTo: { $lte: currentDate },
      expired: { $ne: true },
    },
    { $set: { expired: true } }
  );

  const updateResulttasks = await tasksCollection.updateMany(
    {
      dateAddedTo: { $ne: null, $ne: undefined },
      dateAddedTo: { $lte: currentDate },
      expired: { $ne: true },
    },
    { $set: { expired: true } }
  );

  console.log("events updated as of ", dayjs().format("YYYY-MM-DDTHH:mm:ss"));
});

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
      return dayjs().subtract(13, "year").format("YYYY-MM-DD");
    },
    maxDobDate: function () {
      return dayjs().subtract(150, "year").format("YYYY-MM-DD");
    },
    json: function (context) {
      return JSON.stringify(context);
    },
    includes: function (array, itemToCheck) {
      return array.includes(itemToCheck);
    },
    minAllowedDate: function () {
      return dayjs()
        .year(constants.yearRange[0])
        .startOf("year")
        .format("YYYY-MM-DDTHH:mm");
    },
    maxAllowedDate: function () {
      return dayjs()
        .year(constants.yearRange[constants.yearRange.length - 1])
        .endOf("year")
        .format("YYYY-MM-DDTHH:mm");
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
app.use(express.urlencoded({ extended: true, limit: "1024kb" }));
app.use(rewriteUnsupportedBrowserMethods);

app.use(
  session({
    name: "AuthCookie",
    secret: "CS546",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1800000 },
  })
);

app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.session = req.session.user;
    //todo extend cookie
    var hour = 1800000;
    req.session.cookie.expires = dayjs().add(30, "minute").toDate();
    req.session.cookie.maxAge = hour;
  } else {
    res.clearCookie("AuthCookie");
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
