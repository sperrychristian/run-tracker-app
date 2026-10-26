// establishing express as a variable
const express = require("express");

// establishing router as a variable
const router = express.Router();

const {
  showAllShoes,
  createNewShoe,
  saveNewShoe,
  showOneShoe,
} = require("../controllers/shoeController");

// shows all shoes
router.get("/", showAllShoes);

// create a new shoe
router.get("/new", createNewShoe);

// saves a new shoe
router.post("/", saveNewShoe);

// show one shoe
router.get("/:id", showOneShoe);

module.exports = router;