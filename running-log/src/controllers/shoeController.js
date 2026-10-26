// setup postgres variable
const postgres = require("../app-data-source");

// ---- connecting to the shoe table
// establishing connection to the shoe table from database
const ShoeTable = require("../entities/Shoe.entities");
// querrying the shoe table to assign it to a variable
const shoeRepo = postgres.manager.getRepository(ShoeTable);

// ----------------------

// function to query all shoes left joined to their runs
async function showAllShoes(req, res) {
  // loading each shoes runs so i can total the mileage per shoe
  let shoes = await shoeRepo.find({
        relations: { runs: true },
    order: { name: "ASC" },
  });

  for (let shoe of shoes) {
    // total up the miles on this shoe
    let shoeMileage = 0;
    for (let run of shoe.runs) {
      shoeMileage += parseFloat(run.distanceMiles);
    }

    // attaching the mileage to the shoe object, the view reads one_shoe.mileage
    shoe.mileage = Number(shoeMileage.toFixed(1));
  }

  // sending to the shoes page, the view expects the left side name
  res.render("shoes/index", { all_shoes: shoes });
}

// ----------------------

// function to show the new shoe page
function createNewShoe(req, res) {
  res.render("shoes/new");
}

// ----------------------

// function to save a new shoe
async function saveNewShoe(req, res) {
  // creating a newShoe object
  const newShoe = shoeRepo.create();

  // add fields to the new shoe
  newShoe.name = req.body.name;
  newShoe.brand = req.body.brand;
  // empty date comes in as an empty string so i turn it into null
  newShoe.purchaseDate = req.body.purchaseDate ? req.body.purchaseDate : null;
  // empty retire mileage falls back to the default of 400
  newShoe.retireAtMiles = req.body.retireAtMiles ? parseInt(req.body.retireAtMiles) : 400;

  // save and write the new line to the shoes table
  await shoeRepo.save(newShoe);

  // redirect to base shoes page
  res.redirect("/shoes");
}

// ----------------------

// function to show one shoe
async function showOneShoe(req, res) {
  const shoeId = Number(req.params.id);

  // a non number id like /shoes/abc can't be a real shoe
  if (isNaN(shoeId)) {
    return res.status(404).send("Shoe not found");
  }

  // find the shoe by id, loading its runs and each runs route for the run rows
  const shoe = await shoeRepo.findOne({
    where: { id: shoeId },
        relations: { runs: { route: true } },
  });

  // confirm shoe id is real
  if (!shoe) {
    return res.status(404).send("Shoe not found");
  }

  // total up the miles on this shoe
  let shoeMileage = 0;
  for (let run of shoe.runs) {
    shoeMileage += parseFloat(run.distanceMiles);
  }

  // miles left before this shoe should be retired
  const milesLeft = Number((shoe.retireAtMiles - shoeMileage).toFixed(1));

  // the view expects one_shoe, shoe_mileage, and miles_left
  res.render("shoes/show", {
    one_shoe: shoe,
    shoe_mileage: Number(shoeMileage.toFixed(1)),
    miles_left: milesLeft,
  });
}

module.exports = { showAllShoes, createNewShoe, saveNewShoe, showOneShoe };