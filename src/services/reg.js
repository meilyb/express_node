const RegModel = require('../models/reg');

class RegService {
  static registerUser(users, { login, email, password }) {
    if (!login || !email || !password) {
      throw new Error('Заполните все обязательные поля');
    }

    const existingUser = RegModel.findByLogin(users, login);
    if (existingUser) {
      throw new Error('Пользователь с таким логином уже существует');
    }

    return RegModel.create(users, { login, email, password });
  }
}

module.exports = RegService;
