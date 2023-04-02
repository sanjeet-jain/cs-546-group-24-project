//delete later
import usersFunctions from "./data/users.js";
//
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
/*
try{
  await usersFunctions.create("jeff","bezos","ligma@deez.com","abcDefgh2i",false,"03/03/2000",true);
}catch(e){
  console.log(e);
}
try{
  const deez = await usersFunctions.getUserByEmail('urmom@lol.com');
  console.log(deez);
}catch(e){
  console.log(e);
}
/*
try{
  const deez = await usersFunctions.updateUser(
    '642516dc77a4fe01dcbb4534',
    {first_name:"reese",
    last_name:"puffs",
    email:"hahaha@lol.com",
    Disability:false,
    Dob:"08/02/2001"}
  )
  console.log(deez);
}catch(e){
  console.log(e);
}*/

//---------------------------//
/*
app.use("/login", (req, res, next) => {
  console.log(req.session.id);
  if (req.session.user) {
    return res.redirect('/');
  } else {
    next();
  }
});
*/
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
