const config = require("../../../knexfile") // importando o arquivo knexfile.js
const knex = require("knex")  // importando o knex

// fazendo a conexão:
const connection = knex(config.development)

module.exports = connection