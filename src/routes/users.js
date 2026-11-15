const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const users = req.app.locals.users;

  res.render('users', { 
    title: 'Список пользователей',
    users 
  });
});

module.exports = router;
