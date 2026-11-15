const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const app = express();
const usersRouter = require('./routes/users');

const users = [];
app.locals.users=users;

const products = [ ];

app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
  })
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('home', {
    title: 'Главная страница',
  });
});

app.get('/products/cheap', (req, res) => {
  const cheapProducts = products.filter((product) => product.price < 3000);

  res.render('products', {
    title: 'Недорогие товары',
    products: cheapProducts,
  });
});

app.get('/products/:id', (req, res) => {
  const productId = Number(req.params.id);
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return res.status(404).send('Товар не найден');
  }

  res.render('product', {
    title: product.name,
    product,
  });
});

const sortedProducts = [...products].sort((a, b) => a.price - b.price);

app.get('/products/sorted', (req, res) => {
  res.render('products', {
    title: 'Товары по цене',
    products: sortedProducts,
  });
});


app.get('/registration', (req, res) => {
  res.render('registration', {
    title: 'Окно регистрации',
    error: null,
  });
});

app.post('/registration', (req, res) => {
  const { username, email, password, passConf } = req.body;

  if (!username || !email || !password || !passConf) {
    return res.status(400).render('registration', {
      title: 'Окно регистрации',
      error: 'Пожалуйста, заполните все поля.',
    });
  }

  if (password !== passConf) {
    return res.status(400).render('registration', {
      title: 'Окно регистрации',
      error: 'Пароли не совпадают.',
    });
  }

  const isUserExists = users.some(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (isUserExists) {
    return res.status(400).render('registration', {
      title: 'Окно регистрации',
      error: 'Пользователь с таким email уже зарегистрирован.',
    });
  }

  const newUser = {
    id: users.length + 1,
    username,
    email: email.toLowerCase(),
    password,
  };

  users.push(newUser);

  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', {
    title: 'Окно входа',
    error: null,
  });
});
app.post('/login', (req, res) => {
  const { email, password } = req.body;



  const user = users.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password
  );

  if (!user) {
    return res.status(400).render('login', {
      title: 'Окно входа',
      error: 'Неверный email или пароль.',
    });
  }
  req.session.user={
    username:user.username,
    email:user.email
  };

  res.redirect('/');
});
app.get('/users', (req, res) => {
  res.render('users', {
    title: 'Пользователи',
    error: null,
  });
});
app.use('/users', usersRouter);
app.post('/users',(req,res)=>{
  const { email, login, id } = req.body;

})


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

module.exports = app;