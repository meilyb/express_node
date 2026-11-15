const RegService = require('../services/reg');

class RegController {
  static renderRegPage(req, res) {
    res.render('reg', { title: 'Регистрация' });
  }

  static handleRegistration(req, res) {
    try {
      const users = req.app.locals.users;
      const { login, email, password } = req.body;
      
      RegService.registerUser(users, { login, email, password });
      res.redirect('/login');
    } catch (error) {
      res.render('reg', {
        title: 'Регистрация',
        error: error.message
      });
    }
  }
}

module.exports = RegController;
