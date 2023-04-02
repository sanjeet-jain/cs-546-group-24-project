import express from "express";
const app = express();
import session from 'express-session';
import cookieParser from 'cookie-parser';
import configRoutes from "./routes/index.js";

import exphbs from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  partialsDir: ["views/partials/"],
  helpers: {
    eq: function (a, b) {
      return a === b;
    },
  },
});

app.use("/public", express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: 'AuthCookie',
    secret: "CS546",
    saveUninitialized: false,
    resave: false,
    cookie: {maxAge: 60000}
  })
);

app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
