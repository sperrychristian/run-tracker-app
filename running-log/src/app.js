// loading my environment variables from .env
require("dotenv").config();


// run the loading code for reflect meta-data
require('reflect-metadata')

// pulling in the database connection
const postgreSQL = require("./app-data-source");

// establishing express as a variable
const express = require("express");

// listen for requests using app
const app = express();

// pulling in path so i can point express at my views and public folders
const path = require("path");

// telling express to render pages with ejs from the views folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// giving my css and chart js files from the public folder
app.use(express.static(path.join(__dirname, "..", "public")));

// pulling in each router file
const runRouter = require("./routers/runRouter");
const shoeRouter = require("./routers/shoeRouter");
const routeRouter = require("./routers/routeRouter");
const dashboardRouter = require("./routers/dashboardRouter");

// lets me read form data from req.body on POST requests
app.use(express.urlencoded({ extended: true }));

// attaching each router to the base path it should use
app.use("/runs", runRouter);
app.use("/shoes", shoeRouter);
app.use("/routes", routeRouter);
app.use("/", dashboardRouter);

// connect to the database first, then start the server
postgreSQL
  .initialize()
  .then(() => {
    console.log("database connected");
    app.listen(process.env.PORT || 4000, () => {
      console.log("server is running on port " + (process.env.PORT || 4000));
    });
  })
  .catch((error) => {
    console.log("database connection failed", error);
  });

