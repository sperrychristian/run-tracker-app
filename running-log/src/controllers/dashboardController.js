// setup postgres variable 
const postgres = require("../app-data-source");

// bringing in dayjs so i can group runs by week
const dayjs = require("dayjs");

// ---- connecting to the the run table 
// establishing connection to the run table from database
const RunTable = require('../entities/Run.entities')
// querrying the run table to assign it to a variable 
const runRepo = postgres.manager.getRepository(RunTable);

// ---- connecting to the the shoe table 
// establishing connection to the run table from database
const ShoeTable = require('../entities/Shoe.entities')
// querrying the run table to assign it to a variable 
const shoeRepo = postgres.manager.getRepository(ShoeTable);

// retrieve all information to show on the dashboard
async function getAllInfo(req, res){
    // query shoe table, loading each shoes runs so i can total the milage per shoe
        let shoes = await shoeRepo.find({relations: {runs: true}});
    // query run table, newest runs first, loading the shoe and the route for each run
        let runs = await runRepo.find({relations: {shoe: true, route: true}, order: { runDate:'DESC'}});



    // -------dashboard metrics--------
    // run count total for dashboard 
    let runCount = runs.length;

    // total miles for dashboard 
    let totalMiles = 0;

    // array storing average pace of each run
    let paces = [];

    for (let run of runs) {
        // add the length of each run to the total miles 
        totalMiles += parseFloat(run.distanceMiles);

        let averagePace = parseFloat(run.durationMinutes) / parseFloat(run.distanceMiles)
        // calculate average pace 

        // push average pace of each run into array 
        paces.push(averagePace)
    }

    // avg run pace across all runs for dashboard 
    let totalPace = 0;
    for (let pace of paces) {
        totalPace += pace;
    }

    // guarding against dividing by zero when there are no runs yet
    const totalAvgPace = runCount > 0 ? totalPace / runCount : 0;

    // turning the decimal pace into a minutes:seconds string like 8:15
    const paceSeconds = Math.round(totalAvgPace * 60);
    const averagePaceText = Math.floor(paceSeconds / 60) + ':' + String(paceSeconds % 60).padStart(2, '0');

    // -------recent runs--------
    // runs are already newest first so i just take the first 5
    let recentRuns = runs.slice(0, 5);

    // -------weekly mileage chart--------
    // object storing total miles for each week, keyed by the date the week starts
    let weeklyMiles = {};
    for (let run of runs) {
        // finding the start of the week this run happened in
        const weekStart = dayjs(run.runDate).startOf('week').format('YYYY-MM-DD');
        // adding this run to that week's total
        weeklyMiles[weekStart] = (weeklyMiles[weekStart] || 0) + parseFloat(run.distanceMiles);
    }

    // sorting the weeks oldest to newest and keeping the last 8
    const weekKeys = Object.keys(weeklyMiles).sort().slice(-8);
    // labels and miles for chart.js
    const weekLabels = weekKeys.map(key => dayjs(key).format('MMM D'));
    const weekMiles = weekKeys.map(key => Number(weeklyMiles[key].toFixed(1)));

    // -------shoes close to retirement--------
    let shoesNearRetirement = [];
    for (let shoe of shoes) {
        // total up the miles on this shoe
        let shoeMileage = 0;
        for (let run of shoe.runs) {
            shoeMileage += parseFloat(run.distanceMiles);
        }

        // miles left before this shoe should be retired
        shoe.miles_left = Number((shoe.retireAtMiles - shoeMileage).toFixed(1));

        // only keep shoes with less than 50 miles left
        if (shoe.miles_left < 50) {
            shoesNearRetirement.push(shoe);
        }
    }

    // sending everything to the dashboard view, left side names are what the view expects
    res.render('dashboard', {
        total_miles: totalMiles.toFixed(1),
        run_count: runCount,
        average_pace: averagePaceText,
        week_labels: weekLabels,
        week_miles: weekMiles,
        recent_runs: recentRuns,
        shoes_near_retirement: shoesNearRetirement
    });
}

module.exports = { getAllInfo };