class AppError extends Error {
  constructor(message, status, detalhes) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.detalhes = detalhes;
  }
}

class ValidationError extends AppError {
  constructor(message = 'Dados inválidos', detalhes) {
    super(message, 400, detalhes);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Recurso não encontrado') {
    super(message, 404);
  }
}

module.exports = { AppError, ValidationError, NotFoundError };
