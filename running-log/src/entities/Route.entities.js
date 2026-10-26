const { EntitySchema } = require("typeorm");

const Route = new EntitySchema({
    name: 'Route',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: 'increment',
        },
        name: {
            type: 'varchar'
        },
        distanceMiles: {
            type: 'decimal',
            precision: 5,
            scale: 2
        },
        surface: {
            type: 'varchar'
        }
    },
    relations: {
        runs: {
            type: 'one-to-many',
            target: 'Run',
            inverseSide: 'route'
        }
    }
})

module.exports = Route;