const { EntitySchema } = require("typeorm");

const Tag = new EntitySchema({
  name: "Tag",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    name: {
      type: "varchar",
      unique: true,
    },
  },
  relations: {
    runs: {
      type: "many-to-many",
      target: "Run",
      inverseSide: "tags",
    },
  },
});

module.exports = Tag;
