// using claude to import my runs for the year from garmin to test dashboard and history of database 

// loading my environment variables first so the database connection has its credentials
require("dotenv").config();
require("reflect-metadata");

const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const { parse } = require("csv-parse/sync");

// pulling in the database connection and the run entity
const postgres = require("../src/app-data-source");
const RunTable = require("../src/entities/Run.entities");

// change this to true if my garmin account exports kilometers
const DISTANCE_IS_KM = false;

// the csv file sitting in the project root, can pass a different name as the first argument
const csvName = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "Activities 1.csv";
const csvPath = path.join(__dirname, "..", csvName);

// --dry just prints what it would do and saves nothing
const isDryRun = process.argv.includes("--dry");

// turning a garmin time like 00:52:30 or 52:30 into decimal minutes
function timeToMinutes(timeText) {
  const parts = String(timeText).trim().split(":").map(parseFloat);
  if (parts.some(isNaN)) return null;
  if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60;
  if (parts.length === 2) return parts[0] + parts[1] / 60;
  return null;
}

async function importRuns() {
  // reading the csv, bom true because garmin files can start with a hidden character
  const csvText = fs.readFileSync(csvPath, "utf-8");
  const rows = parse(csvText, { columns: true, skip_empty_lines: true, bom: true });
  console.log("rows in csv:", rows.length);

  await postgres.initialize();
  const runRepo = postgres.getRepository(RunTable);

  // loading existing runs so i can skip anything already in the table
  const existingRuns = await runRepo.find();
  const existingKeys = new Set(
    existingRuns.map((run) => dayjs(run.runDate).format("YYYY-MM-DD") + "|" + Number(run.distanceMiles).toFixed(2))
  );

  let newRuns = [];
  let skipped = 0;

  for (let row of rows) {
    // only keeping running activities, this also catches trail running and treadmill running
    if (!String(row["Activity Type"]).includes("Running")) {
      skipped++;
      continue;
    }

    // distance can have commas in it, so i strip them before converting
    let distance = parseFloat(String(row["Distance"]).replace(/,/g, ""));
    if (DISTANCE_IS_KM) distance = distance * 0.621371;

    const minutes = timeToMinutes(row["Time"]);

    // skipping rows with no distance or time since pace divides by distance
    if (isNaN(distance) || distance <= 0 || minutes === null) {
      skipped++;
      continue;
    }

    const runDate = dayjs(row["Date"]).format("YYYY-MM-DD");
    const key = runDate + "|" + distance.toFixed(2);

    // skipping runs that are already in the table
    if (existingKeys.has(key)) {
      skipped++;
      continue;
    }
    existingKeys.add(key);

    newRuns.push(
      runRepo.create({
        runDate: runDate,
        distanceMiles: distance.toFixed(2),
        durationMinutes: minutes.toFixed(2),
        notes: row["Title"] || null,
        effort: null,
        shoe: null,
        route: null,
      })
    );
  }

  console.log("runs to add:", newRuns.length, "| skipped:", skipped);

  if (isDryRun) {
    // showing the first few so i can check the units and dates look right
    console.log(newRuns.slice(0, 5));
    console.log("dry run, nothing saved");
  } else {
    await runRepo.save(newRuns);
    console.log("saved", newRuns.length, "runs");
  }

  // closing the connection so the script exits
  await postgres.destroy();
}

importRuns().catch((error) => {
  console.log("import failed", error);
  process.exit(1);
});