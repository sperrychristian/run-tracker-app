// setup postgres variable
const postgres = require("../app-data-source");

// ---- connecting to the the route table
// establishing connection to the run table from database
const RunTable = require("../entities/Run.entities");
// querrying the run table to assign it to a variable
const runRepo = postgres.manager.getRepository(RunTable);

// ---- connecting to the shoe table so i can fill the shoe dropdown
const ShoeTable = require("../entities/Shoe.entities");
const shoeRepo = postgres.manager.getRepository(ShoeTable);

// ---- connecting to the route table so i can fill the route dropdown
const RouteTable = require("../entities/Route.entities");
const routeRepo = postgres.manager.getRepository(RouteTable);

// ---- connecting to the tag table so i can fill the tag pills
const TagTable = require("../entities/Tag.entities");
const tagRepo = postgres.manager.getRepository(TagTable);

// ----------------------

// function to query all runs left joined to routes and shoes
async function getAllRuns(req, res) {
  // order by latest runs at the top of the table
  let runs = await runRepo.find({
        relations: { route: true, shoe: true },
    order: { runDate: "DESC" },
  });

  // sending to the runs page, the view expects the left side name
  res.render("runs/index", { all_runs: runs });
}

// ----------------------

// function to show the new run page
async function createNewRun(req, res) {
  // getting the lists that fill the shoe dropdown, route dropdown, and tag pills
  const shoes = await shoeRepo.find();
  const routes = await routeRepo.find();
  const tags = await tagRepo.find();

  res.render("runs/new", {
    all_shoes: shoes,
    all_routes: routes,
    all_tags: tags,
  });
}

// ----------------------

// function to save a new run
async function saveNewRun(req, res) {
  // creating a newRun object
  const newRun = runRepo.create();

  // add fields to the new run
  newRun.runDate = req.body.runDate;
  newRun.distanceMiles = req.body.distanceMiles;
  newRun.durationMinutes = req.body.durationMinutes;

  // empty effort comes in as an empty string so i turn it into null
  newRun.effort = req.body.effort ? parseInt(req.body.effort) : null;
  newRun.notes = req.body.notes;

  // pointing the run at its shoe and route, or null when none was picked
  newRun.shoe = req.body.shoeId ? { id: parseInt(req.body.shoeId) } : null;
  newRun.route = req.body.routeId ? { id: parseInt(req.body.routeId) } : null;

  // tags is an array of objects with just the id in each
  newRun.tags = [].concat(req.body.tags || []).map((tagId) => ({ id: parseInt(tagId) }));

  // save and write the new line to the runs table
  await runRepo.save(newRun);

  // redirect to base routes page
  res.redirect("/runs");
}

// ----------------------

// get the edit page for one run
async function showOneRun(req, res) {
  const runId = Number(req.params.id);

  // a non number id like /runs/abc can't be a real run
  if (isNaN(runId)) {
    return res.status(404).send("Run not found");
  }

  // find the run by id, loading its shoe, route, and tags for the page
  const run = await runRepo.findOne({
    where: { id: runId },
        relations: { shoe: true, route: true, tags: true },
  });

  // confirm run id is real
  if (!run) {
    return res.status(404).send("Run not found");
  }

  // render the view associated
  res.render("runs/show", { one_run: run });
}

// ----------------------

// show edit a run
async function editRun(req, res) {
  const runId = Number(req.params.id);

  // a non number id can't be a real run
  if (isNaN(runId)) {
    return res.status(404).send("Run not found");
  }

  // find the run by id, loading the relations so the form can preselect them
  const run = await runRepo.findOne({
    where: { id: runId },
        relations: { shoe: true, route: true, tags: true },
  });

  // confirm run id is real
  if (!run) {
    return res.status(404).send("Run not found");
  }

  // getting the lists that fill the shoe dropdown, route dropdown, and tag pills
  const shoes = await shoeRepo.find();
  const routes = await routeRepo.find();
  const tags = await tagRepo.find();

  res.render("runs/edit", {
    one_run: run,
    all_shoes: shoes,
    all_routes: routes,
    all_tags: tags,
  });
}

// ----------------------

// save the an edit run
async function saveEditRun(req, res) {
  const runId = Number(req.params.id);

  // a non number id can't be a real run
  if (isNaN(runId)) {
    return res.status(404).send("Run not found");
  }

  // find the existing run, loading its tags so typeorm can swap them out
  const run = await runRepo.findOne({
    where: { id: runId },
        relations: { tags: true },
  });

  // confirm run id is real
  if (!run) {
    return res.status(404).send("Run not found");
  }

  // overwrite the fields with whatever came from the form
  run.runDate = req.body.runDate;
  run.distanceMiles = req.body.distanceMiles;
  run.durationMinutes = req.body.durationMinutes;
  run.effort = req.body.effort ? parseInt(req.body.effort) : null;
  run.notes = req.body.notes;

  // same relation handling as saveNewRun
  run.shoe = req.body.shoeId ? { id: parseInt(req.body.shoeId) } : null;
  run.route = req.body.routeId ? { id: parseInt(req.body.routeId) } : null;
  run.tags = [].concat(req.body.tags || []).map((tagId) => ({ id: parseInt(tagId) }));

  // save the changes to the existing row
  await runRepo.save(run);

  // send me to the page for the run i just edited
  res.redirect("/runs/" + runId);
}

// ----------------------

// delete a run
async function deleteRun(req, res) {
  const runId = Number(req.params.id);

  // a non number id can't be a real run
  if (isNaN(runId)) {
    return res.status(404).send("Run not found");
  }

  // remove the row, typeorm cleans up the run_tags rows for me
  await runRepo.delete({ id: runId });

  // back to the list of runs
  res.redirect("/runs");
}

module.exports = {
  getAllRuns,
  createNewRun,
  saveNewRun,
  showOneRun,
  editRun,
  saveEditRun,
  deleteRun,
};


