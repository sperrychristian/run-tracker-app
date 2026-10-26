const { EntitySchema } = require("typeorm");

const Run = new EntitySchema({
  name: "Run",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    runDate: {
      type: "date",
    },
    distanceMiles: {
      type: "decimal",
      precision: 5,
      scale: 2,
    },
    durationMinutes: {
      type: "decimal",
      precision: 6,
      scale: 2,
    },
    effort: {
      type: "int",
      nullable: true,
    },
    notes: {
      type: "text",
      nullable: true,
    },
  },
  relations: {
    shoe: {
      type: "many-to-one",
      target: "Shoe",
      joinColumn: { name: "shoeId" },
      inverseSide: "runs",
      nullable: true,
    },
    route: {
      type: "many-to-one",
      target: "Route",
      joinColumn: { name: "routeId" },
      inverseSide: "runs",
      nullable: true,
    },
    tags: {
      type: "many-to-many",
      target: "Tag",
      joinTable: { name: "run_tags" },
      inverseSide: "runs",
    },
  },
});

module.exports = Run;
