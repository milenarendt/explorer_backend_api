const { hash, compare } = require("bcryptjs")  // importando a função que faz a criptografia da senha e que compara as senhas criptografadas
const AppError = require("../utils/AppError") // importando o apperror
const sqliteConnection = require("../database/sqlite")
const usersRouter = require("../routes/users.routes")

class UsersController {
 async create(request, response) {
  const { name, email, password } = request.body

  const database = await sqliteConnection()  // fazendo a conexão com o banco de dados
  
  const checkIfUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [ email ])  // para verificar se o usuário ja existe através do email

  if(checkIfUserExists) {  // se o email ja existe
    throw new AppError("Este e-mail já está em uso.")
  }

  const hashedPassword = await hash(password, 8)

  await database.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",   // onde tem ? vai substituído pela informação que o usuário colocar
    [ name, email, hashedPassword ]    // ele vai respeitar a ordem das interrogações
  )

  return response.status(201).json() // não está devolvendo nada
 }

 async update(request, response) {
  const { name, email, password, old_password } = request.body
  const { id } = request.params

  const database = await sqliteConnection()  // fazendo a conexão com o banco de dados
  
  const user = await database.get("SELECT * FROM users WHERE id = (?)", [ id ])

  if(!user) {  // caso o usuário não exista
    throw new AppError("Usuário não encontrado.")
  }

  const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [ email ])

  if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) { // se o email que o usuário que o usuário quer colocar for igual ao email de outro usuário que ja existe
    throw new AppError("Este e-mail já está em uso.")
  }

  // se passar direto por todas as verificações acima, vai atualizar o nome e email para os novos dados que o usuário informou:
  user.name = name ?? user.name   // ou name ou user.name, para o caso de nao querer atualizar o nome e deixar em branco
  user.email = email ?? user.email

  if(password && !old_password) { // caso o usuário não insira a senha antiga
    throw new AppError("Informe a senha antiga para poder definir a nova senha.")
  }

  if(password && old_password) {
    const checkOldPassword = await compare(old_password, user.password) // comparando a senha antiga com a nova senha desse usuário

    if(!checkOldPassword) {
      throw new AppError("A senha antiga não confere.")
    }

    user.password = await hash(password, 8) // se a senha conferir, vai atualizar a senha criptografando novamente
  }

  // fazer a atualização do banco de dados:
  await database.run(`
    UPDATE users SET
    name = ?,
    email = ?,
    password = ?,
    updated_at = DATETIME('now')
    WHERE id = ?`,
    [user.name, user.email, user.password, id] 
    )

    return response.json()  // vai retornar por padrão o status 200 de sucesso
 }

}


module.exports = UsersController