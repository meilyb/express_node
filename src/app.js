const express = require('express'); 
import loginRouter from './routes/login.js';

const users = []; 
const app=express();
app.use(express.json());
app.use('/login',loginRouter);

const {engine}=require("express-handlebars");
const path=require("path");
const app=express();
hbs.registerPartials(__dirname+ "/views/partials");
app.engine("handlebars",engine());
app.set("view engine","handlebars");
app.set(
"views",
path.join(__dirname,"views")
);
app.use(express.static(
    path.join(__dirname,"../public")
));
app.get("/",(req,res)=>{
    res.render("home",{
        title:"главная страница"
    });
});
app.get("/products/cheap",(req,res)=>
{
    const cheapProducts=products.filter(
        product=>product.price<3000
    );
    res.render("products",{
        title:"недорогие тогвары",
        products:cheapProducts
    });
});
app.get("/products/:id",(req,res)=>{
    const productId=Number(req.params.id);
    const product=products.find(item=>item.id===productId);
    if(!product){
        return res.status(404).send("товар не найден");
    }
    res.render("product",{
        title:product.name,
        product
    });
});
const sortedProducts=[...products].sort(
    (a,b)=>a.price-b.price
);
app.get("/registration",(req,res)=>{
    res.render("registration.hbs",{
        title:"окно регистрации"
    });
});
app.get("/login",(req,res)=>{
    res.render("login.hbs",{
        title:"окно входа"
    });
});
app.post("/registration",(req,res)=>{
    const { username, email, password, passConf } = req.body;
    if (!username || !email || !password || !passConf) {
        return showErorr('Пожалуйста, заполните все поля.');
    }
    if (password !== passConf) {
        return showErorr('Пароли не совпадают.');
    }
    const isUserExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());
    if (isUserExists) {
        return showErorr('Пользователь с таким email уже зарегистрирован.');
    }
    const newUser = {
        username: username,
        email: email.toLowerCase(),
        password: password 
    };
    users.push(newUser);

});
app.listen(3000,()=>{
    console.log("сервер запущен на http://localhost:3000");
});

export default app;
