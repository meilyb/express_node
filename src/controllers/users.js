const UsersService = require('../services/users');

class UsersController {
  static renderUsers(req, res) {
    const allUsers = req.app.locals.users;
    const users = UsersService.getAllUsers(allUsers);
    
    res.render('users', {
      title: 'Список пользователей',
      users
    });
  }
}

module.exports = UsersController;

