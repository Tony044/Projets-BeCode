import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

const pool=mariadb.createPool({
    host : process.env.host,
    user: process.env.user,
    database: process.env.db,
    password: process.env.password,
    connectionLimit: 5
});

export default pool;

//DO NOT MODIFY !!!!!!