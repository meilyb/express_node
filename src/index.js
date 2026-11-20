
require('dotenv').config(); 
const { configDotenv } = require('dotenv');
const app = require('./app');
const sequelize=require('./db')
const PORT = process.env.PORT || 3000;

async function start(){
    try{
        await sequelize.authenticate();
        await sequelize.sync();
        console.log("sqlite подключен");
        console.log('таблица users готовва');
        app.listen(PORT, () => 
{ console.log(`Server is running: http://localhost:${PORT}`); });
    }catch(error){
  console.error('ошибка запуска: ',error);
  process.exitCode=1;
    }
}
start();