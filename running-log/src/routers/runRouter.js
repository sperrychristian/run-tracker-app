// establishing express as a variable
const express = require("express");

// establishing router as a variable
const router = express.Router();

// import all controllers for run functions
const {
  getAllRuns,
  createNewRun,
  saveNewRun,
  showOneRun,
  editRun,
  saveEditRun,
  deleteRun,
} = require("../controllers/runController");

// shows all runs
router.get("/", getAllRuns);

// create a new run
router.get("/new", createNewRun);

// save a new run
router.post("/", saveNewRun);

// shows one run
router.get("/:id", showOneRun);

// show edit a run
router.get("/:id/edit", editRun);

// save the an edit run
router.post("/:id/edit", saveEditRun);

// delete a run
router.post("/:id/delete", deleteRun);

module.exports = router;