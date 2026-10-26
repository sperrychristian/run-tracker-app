const { EntitySchema } = require("typeorm");

const Shoe = new EntitySchema({
    name: 'Shoe',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: 'increment',
        },
        name: {
            type: 'varchar'
        },
        brand: {
            type: 'varchar'
        },
        purchaseDate: {
            type: 'date',
            nullable: true
        },
        retireAtMiles: {
            type: 'int',
            default: 400
        }
    },
    relations: {
        runs: {
            type: 'one-to-many',
            target: 'Run',
            inverseSide: 'shoe'
        }
    }
})

module.exports = Shoe;