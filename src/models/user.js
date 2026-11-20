const {DataTypes}=require('sequelize');
const  bcrypt=require('bcryptjs');
const sequelize=require('../db');

const User=sequelize.define('User',{
username:{
type:DataTypes.STRING,
allowNull:false,
unique:true,
validate:{
    notEmpty:{
        msg:"имя пользователя не может быть пустым"
    },
    len:{
        args:[3,30],
        msg:"имя пользователя должно содержать от 3 до 30 символов"
    }
 }
},
email:{
    type:DataTypes.STRING,
    allowNull:false,
    unique:true,
    validate:{
        notEmpty:{
            msg:"email не может быть пустым"
        },
        isEmail:{
            
            msg:"введите корректный email"
        }
     }
},
password:{
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
        len:{
            args:[6,100],
            msg:"пароль должен содержать минимум 6 символов"
        }
    }
}
},{
    tableName:'users',
    timestamps:true,
    hooks:{
        beforeCreate:async (user)=>{
            if(user.password){
                user.password=await bcrypt.hash(user.password,10)
            }
        },
        beforeUpdate: async (user)=>{
            if(user.changed('password')){
                user.password=await bcrypt.hash(user.password,10)
            }
        }
    }

});
module.exports=User;