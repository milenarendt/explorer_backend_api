const sqliteConnection = require('../../sqlite')  // importando a função de conexão
const createUsers = require('./createUsers') 

// função para executar/rodar as migrations:
async function migrationsRun() {
  const schemas = [
    createUsers
  ].join('')

  sqliteConnection()
    .then(db => db.exec(schemas)) // executando as schemas
    .catch(error => console.error(error))  // para o caso de dar algum erro
}

module.exports = migrationsRun