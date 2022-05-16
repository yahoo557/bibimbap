const { Pool, Client } = require('pg')
const Query = require('pg').Query
const client = new Client({
    user: 'seungbaek',
    host: '127.0.0.1',
    database: 'noldaga',
    password: 'bi1234',
    port: 5432,
});
client.connect();