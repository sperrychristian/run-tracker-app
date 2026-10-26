// establishing express as a variable
const express = require("express");

// establishing router as a variable
const router = express.Router();

const { getAllInfo } = require("../controllers/dashboardController");

// show all dashboard info
router.get("/", getAllInfo);

module.exports = router;