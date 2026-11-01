import 'dotenv/config';
const express=require("express");
const app=express();
const port=process.env.PORT;
app.use((req,res,next)=>{
    console.log("заппос пришел");
    next();
});
app.use((req,res,next)=>{
    console.log("проверяем запрос");
    next();
});
app.get("/",(req,res)=>{
    console.log("заппос пришел");
  res.send("привет")
});
app.listen(3000,()=>{
    console.log("server started  on port 3000");
});
app.use((req,res,next)=>
{
    console.log(req.method,req.url);
    next();
});
app.get("/",(req,res)=>{
    res.send("главная страница");
});
app.listen(3000);

app.get("/products",(req,res)=>{
    res.send("список товаров");
});
app.post("/products",(req,res)=>{
    res.send("создать товар");
});
app.delete("/products",(req,res)=>{
    res.send("удалить товары");
});
app.get("/user",(req,res)=>{
    res.json({
        id:1,
        name:"Anna",
        role:"student"
    });
});
app.use((req,res,next)=>{
    const isAllowed=false;
    if(!isAllowed){
        return res.status(403).send("доступа нету");
    }
    next();
});
app.get("/",(req,res)=>{
    res.send("добро пожаловать");
});
