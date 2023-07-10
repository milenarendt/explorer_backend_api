// para tratar erros do lado do cliente
// precisamos add a biblioteca Express Async Error e tratar o erro no server.js, para aparecer uma mensagem bonitinha

class AppError {
  message;
  statusCode; // criando as variáveis no topo para que toda a classe tome conhecimento dela

  constructor(message, statusCode = 400) { //statusCode padrão será 400 - erro do cliente (caso ele não seja informado)
    this.message = message
    this.statusCode = statusCode  // repassando o statusCode desse escopo para o do escopo global
  }
}

module.exports = AppError