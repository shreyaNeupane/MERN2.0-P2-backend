import { Sequelize, DataTypes } from "sequelize";
import dbConfig from "../config/dbConfig";
import { prototype } from "events";

const sequelize = new Sequelize(dbConfig.db , dbConfig.user , dbConfig.password,{
    host: dbConfig.host,
    dialect : dbConfig.dialect,
    port : 3306,
    pool: {
        acquire : dbConfig.pool.acquire,
        min : dbConfig.pool.min,
        max : dbConfig.pool.max,
        idle : dbConfig.pool.idle,
    }
})

sequelize
.authenticate()
.then(()=>{
    console.log("connected")
})
.catch((err)=>{
    console.log(err)
})

const db:any = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.sequelize.sync({force : false}).then(()=>{
    console.log("yes migrated")
})

export default db