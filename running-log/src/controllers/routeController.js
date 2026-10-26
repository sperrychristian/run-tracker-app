// setup postgres variable 
const postgres = require("../app-data-source");

// ---- connecting to the the route table 
// establishing connection to the route table from database
const RouteTable = require('../entities/Route.entities')
// querrying the route table to assign it to a variable 
const routeRepo = postgres.manager.getRepository(RouteTable);

// ----------------------

// function to query all routes joined left joined to runs 
async function getAllRoutes(req, res) {
       let routes = await routeRepo.find({relations: {runs: true}});

// sending the routes to the roues page, the view expects the left side name 
    res.render('routes/index', {all_routes: routes});    
}

// ----------------------

// function to show the new route page 
function createNewRoute(req, res) {
    res.render('routes/new')
}

// ----------------------

// function to save a new route 
async function saveNewRoute(req, res) {

    // creating a newRoute object 
    const newRoute = routeRepo.create();

    // add fields to the new route 
    newRoute.name = req.body.name;
    newRoute.distanceMiles = req.body.distanceMiles;
    newRoute.surface = req.body.surface;

    // save and write the new line to the routes table 
    await routeRepo.save(newRoute)
    
    // redirect to base routes page
    res.redirect('/routes')
}

// ----------------------

module.exports = { getAllRoutes, createNewRoute, saveNewRoute };