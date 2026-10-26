// establishing express as a variable
const express = require("express");

// establishing router as a variable
const router = express.Router();

// import all controllers to handle routes for running routes
const {
  getAllRoutes,
  createNewRoute,
  saveNewRoute,
} = require("../controllers/routeController");

// shows all saved routes
router.get("/", getAllRoutes);

// create a new route
router.get("/new", createNewRoute);

// save a new route
router.post("/", saveNewRoute);

module.exports = router;
