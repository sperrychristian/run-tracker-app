# Explanation
I selfishly built a running log app I could use for this assignment. It tracks runs, the shoes I ran in, and the routes I ran on. I built the landing page to show a dashboard with totals, a weekly mileage chart, and shoes that are close to being worn out. I imported CSV data from my garmin account to add to my database so the dashboard I built would display historical runs from my year.

## How I met each requirement

**1. Built with Express.**
I created the Express app in `src/app.js`. 

**2. At least one POST request.**
I tried to make the app something useable so in some circumstances I went beyond the requirements listed in the rubric. I handle POST requests in `saveNewRun`, `saveEditRun`, and `deleteRun` in `runController.js`, `saveNewShoe` in `shoeController.js`, and `saveNewRoute` in `routeController.js`. The forms in `views/runs/new.ejs`, `views/shoes/new.ejs`, and `views/routes/new.ejs` send them.

**3. At least one GET request.**
Every page I built is loaded using a GET route. They are defined in the files in `src/routers`.

**4. At least 3 routers.**
I have four routers in `src/routers`. They're `runRouter.js`, `shoeRouter.js`, `routeRouter.js`, and `dashboardRouter.js`. Each one is directed to it's own base path in `app.js`.

**5. A route with a dynamic segment.**
`/runs/:id`, `/runs/:id/edit`, `/runs/:id/delete`, and `/shoes/:id` use `req.params.id` to look up one row. They are in `runRouter.js` and `shoeRouter.js`, where the controllers read the id created in by the table.

**6. Pages are dynamically rendered.**
I used EJS for my project (I figured there will be plenty of time to learn React and it would be good to get practice with EJS.). The controllers call `res.render` with data from the database, and the views in `src/views` loop over that data.

**7. Views are broken into reusable components.**
I made EJS partials in `src/views/partials`. They're `head.ejs`, `navbar.ejs`, `footer.ejs`, `pageHeader.ejs`, `statTile.ejs`, `runCard.ejs`, `formField.ejs`, `runForm.ejs`, and `emptyState.ejs`. These modularized components are used across the board throughout the app! 

**8. At least 3 controllers.**
I have four controllers in `src/controllers`. They're `runController.js`, `shoeController.js`, `routeController.js`, and `dashboardController.js`.

**9. At least 3 models.**
I used the TypeORM library exactly how we practiced in class and have four models in `src/entities`. They're `Run.entities.js`, `Shoe.entities.js`, `Route.entities.js`, and `Tag.entities.js`. Each one defines a table's columns and its relations.

**10. Uses an ORM, not raw SQL.**
All of my controllers are written to get a repository for each entity (`runRepo`, `shoeRepo`, `routeRepo`, `tagRepo`) and use `find`, `findOne`, `create`, `save`, and `delete`. 

**11. Connected to a relational database.**
`src/app-data-source.js` connects to a Postgres database. I just used the existing one you had built us all login access for with my A#. 

**12. At least 3 tables.**
My database has `run`, `shoe`, `route`, and `tag` tables, plus a `run_tags` join table that TypeORM makes for the many-to-many relation between runs and tags.

**13. Looks professional.**
I leaned on AI like we had in class for styling and HTML. In this case, I use Bootstrap 5 in dark mode. It has a dark theme with a green accent, custom fonts, stat tiles, progress bars for shoe mileage, and a Chart.js bar chart in `public/js/dashboardChart.js`. 

**14. A library I had never used before.**
I used `dayjs`, which I had never used before. In `dashboardController.js` I use `dayjs(run.runDate).startOf('week')` to group my runs by week for the weekly mileage chart, and I use it to format the week labels. If that is too minimal of a use case to meet requirements for this please let me know and I'll adjust and use something new. (I haven't used bootstrap before but I feel like that doesn't count as much since I didn't write that code by hand)

## Extra notes

- `scripts/importGarmin.js` is a one-time helper I wrote to load my Garmin activity export into the run table. It is not part of the app itself.

## Architectural decision

I defined my models with TypeORM's `EntitySchema`, and I load each page's relations in its own controller query (for example `relations: { runs: true }` for the shoes page), because this keeps the entity files as plain descriptions of the tables, keeps the logic in the controllers, and means each page only fetches the data it actually displays.