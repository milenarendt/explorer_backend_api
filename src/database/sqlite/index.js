const sqlite3 = require("sqlite3")  // importando o sqlite
const sqlite = require("sqlite") 
const path = require("path") // biblioteca que ja vem instalada automaticamente no node e que faz com que os endereços (ex do filename) não se percam quando munda o navegador

async function sqliteConnection() { // precisa ser uma função assíncrona, pois se não existir o banco de dados ele vai criar, e se já existir ele vai conectar com ele, essas coisas não acontecem ao mesmo tempo
  const database = await sqlite.open({ // abrindo uma conexão
    filename: path.resolve(__dirname, "..", "database.db"),    //filename: propriedade que diz onde o arquivo vai ficar salvo
    driver: sqlite3.Database
  })

  return database
}

module.exports = sqliteConnection