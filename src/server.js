require("express-async-errors") // importando a biblioteca para erros
const express = require("express")  // importando o express
const migrationsRun = require("./database/sqlite/migrations")
const AppError = require("./utils/AppError")
const routes = require("./routes") // importando, vai carregar por padrão o index.js
migrationsRun() // executando o banco de dados

const app = express() // inicializando o express
app.use(express.json())

app.use(routes)



// tratando os erros
app.use(( error, request, response, next) => {
  if(error instanceof AppError) { // se o erro for do tipo AppError, do lado do cliente
      return response.status(error.statusCode).json({
        status: "error",
        message: error.message
      })
  }

  console.error(error) // para eu conseguir debugar o erro, se necessário

  return response.status(500).json({  // se o erro for do lado do servidor
    status: "error",
    message: "Internal server error" // mensagem padrão
  })
}) 

const PORT = 3333 // informando ao express qual a porta em que a API vai ficar esperando requisições

// o app vai ficar escutando a porta e vai rodar a função quando a aplicação iniciar
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))