const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const app = express();
const bcrypt=require('bcryptjs')
const usersRouter = require('./routes/users');
const User =require('./models/user')


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

app.post('/registration', async (req, res) => {
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
  try{
    await User.create({
      username,
      email,
      password
    });
    res.redirect('/login');
  }catch(error){
    console.error(error);
    let message='не удалось зарг-вать пользователя';
    if(error.name==='SequelizeUniqueConstraintError'){
      if(error.errors.some(item=>item.path==='username')){
        message='такое имя пользователя уже занято';
      }else if(error.errors.some(item=>item.path==='email')){
        message='такоq email уже занят';
      }
    }else if(error.name==='SequelizeValidationError'){
      message=error.errors.map(item=>item.message).join(' ');
    }
    res.render('registration',{
      title:'регистрация',
      error:message
    });

  }
});

app.get('/login', (req, res) => {
  res.render('login', {
    title: 'Окно входа',
    error: null,
  });
});
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

try{
  const user=await User.findOne({
    where:{email}
  });
  if(!user){
    return res.render('login',{
      title:'вход',
      error:'неверный email или пароль'
    });
  }
  const isPasswordCorrect=await bcrypt.compare(
    password,
    user.password
  );
  if(!isPasswordCorrect){
    return res.render('login',{
      title:'вход',
      error:'неверный email или пароль'
    });
  }
  req.session.user={
    id:user.id,
    username:user.username,
    email:user.email
  };
  res.redirect('/');
}catch(error){
  console.error(error);
  res.status(500).send('ошиька сервера');
}
});
app.post('/logout',(req,res)=>{
  req.session.destroy(()=>{
    res.redirect('/login');
  });
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
