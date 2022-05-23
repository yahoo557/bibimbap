const { Pool, Client } = require('pg')
const Query = require('pg').Query
const client = new Client({
    user: 'bibimbap',
    host: '127.0.0.1',
    database: 'noldaga',
    password: '111111',
    port: 5432
});
client.connect();

module.exports = client;