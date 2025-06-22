type Database = {
    host: string,
    user: string,
    password : string,
    db: string,
    // port : number,
    dialect : 'mysql'|'postgres',
    // katiota connection open garne
    pool : {    
        max: number,
        min: number,
        idle:number,
        acquire : number
    }

}

const dbConfig:Database = {
    host:'localhost',
    user:'root',
    password : '',
    // port : 3306,
    db: 'project2database',
    dialect :'mysql',
    pool : {
        idle : 10000,
        max:5,
        min:0,
        acquire: 10000

    }
}

export default dbConfig 