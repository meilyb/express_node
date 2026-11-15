const UsersModel = require('../models/users');

class UsersService {
  static getAllUsers(users) {
    const allUsers = UsersModel.findAll(users);
    return allUsers.map(({ password, ...safeUser }) => safeUser);
  }
}

module.exports = UsersService;
